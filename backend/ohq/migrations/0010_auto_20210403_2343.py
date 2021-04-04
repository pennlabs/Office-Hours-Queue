# Generated by Django 3.1.7 on 2021-04-03 23:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ohq', '0009_auto_20210201_2224'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseStatistic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('metric', models.CharField(choices=[('STUDENT_QUESTIONS_ASKED', 'Student: Questions asked'), ('STUDENT_TIME_BEING_HELPED', 'Student: Time spent being helped'), ('INSTR_QUESTIONS_ANSWERED', 'Instructor: Questions answered'), ('INSTR_TIME_SPENT_ANSWERING', 'Instructor: Time spent answering questions')], max_length=256)),
                ('value', models.DecimalField(decimal_places=8, max_digits=16)),
                ('date', models.DateField(blank=True, null=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ohq.course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='coursestatistic',
            constraint=models.UniqueConstraint(fields=('user', 'course', 'metric', 'date'), name='course_statistic'),
        ),
    ]
