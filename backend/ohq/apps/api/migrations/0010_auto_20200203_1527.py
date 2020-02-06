# Generated by Django 2.2.7 on 2020-02-03 15:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20200203_0404'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackanswer',
            name='feedback_question',
            field=models.ForeignKey(default='69c95810-07bf-4f75-9ef2-9a62de1c90d0', on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='api.FeedbackQuestion'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='feedbackanswer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feedback_answers', to='api.Question'),
        ),
    ]