# Generated by Django 4.0.3 on 2022-03-08 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0001_initial'),
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='members',
            field=models.ManyToManyField(default=None, related_name='projects', to='members.member'),
        ),
    ]