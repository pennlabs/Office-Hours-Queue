# Generated by Django 2.2.7 on 2020-03-16 05:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20200316_0325'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='video_chat_enabled',
            field=models.BooleanField(default=False),
        ),
    ]