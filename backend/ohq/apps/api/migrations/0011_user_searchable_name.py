# Generated by Django 2.2.7 on 2020-03-15 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    def set_searchable_name(apps, schema_editor):
        User = apps.get_model('api', 'User')
        for user in User.objects.all().iterator():
            user.searchable_name = f"{user.full_name} {user.preferred_name} {user.email}"
            user.save()

    def reverse_set_searchable_name(apps, schema_editor):
        pass

    dependencies = [
        ('api', '0010_auto_20200222_2216'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='searchable_name',
            field=models.CharField(default='', editable=False, max_length=456),
            preserve_default=False,
        ),
        migrations.RunPython(set_searchable_name, reverse_set_searchable_name),
    ]