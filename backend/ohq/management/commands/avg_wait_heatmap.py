from django.core.management.base import BaseCommand
from django.db.models import Avg, F
from django.utils import timezone

from ohq.models import Question, Queue, QueueStatistic


class Command(BaseCommand):
    help = "Recalculate the heatmap statistics for yesterday's weekday"

    def handle(self, *args, **kwargs):
        queues = Queue.objects.filter(archived=False)

        # assuming the cron job runs daily at midnight, we only need to update yesterday's weekday
        yesterday = timezone.datetime.today().date() - timezone.timedelta(days=1)
        yesterday_weekday = yesterday.weekday()

        # django weekday is diff from normal datetime weekdays
        django_yesterday_weekday = (yesterday_weekday + 1) % 7 + 1

        for queue in queues:
            prev_weekday_questions = Question.objects.filter(
                queue=queue, time_response_started__week_day=django_yesterday_weekday
            )

            for time_interval in QueueStatistic.TIME_RANGE_CHOICES:
                range_start = time_interval[0]
                range_end = range_start + QueueStatistic.TIME_RANGE_INTERVAL

                interval_avg = prev_weekday_questions.filter(
                    time_response_started__hour__range=[range_start, range_end]
                ).aggregate(avg_wait=Avg(F("time_response_started") - F("time_asked")))

                interval_avg_wait = interval_avg["avg_wait"]

                QueueStatistic.objects.update_or_create(
                    queue=queue,
                    metric=QueueStatistic.METRIC_HEATMAP_WAIT,
                    day=yesterday_weekday,
                    time_range=range_start,
                    defaults={"value": interval_avg_wait.seconds if interval_avg_wait else 0},
                )
