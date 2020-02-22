# Generated by Django 2.2.7 on 2020-02-22 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    def set_searchable_name(apps, schema_editor):
        Course = apps.get_model('api', 'Course')
        for course in Course.objects.all().iterator():
            course.searchable_name = f"{course.department} {course.course_code}" \
                                     f" {course.course_title}"
            course.save()

    def reverse_set_searchable_name(apps, schema_editor):
        pass


    dependencies = [
        ('api', '0007_auto_20200222_1836'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='description',
            field=models.CharField(default='', max_length=250),
        ),
        migrations.AlterField(
            model_name='course',
            name='course_title',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='course',
            name='searchable_name',
            field=models.CharField(max_length=72),
        ),
        migrations.RunPython(set_searchable_name, reverse_set_searchable_name),
    ]
