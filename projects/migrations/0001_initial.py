# Generated by Django 4.0.3 on 2022-03-04 00:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default=None, max_length=100)),
                ('tldr', models.CharField(default=None, max_length=140)),
                ('description', models.TextField(default=None, max_length=1000)),
                ('status', models.CharField(choices=[('', 'Select'), ('IDEATING', 'Ideating'), ('EXPLORING', 'Exploring'), ('BUILDING', 'Building')], default=None, max_length=100)),
                ('hero_image', models.CharField(default=None, max_length=500)),
                ('project_images', models.CharField(default=None, max_length=2000)),
                ('members', models.ManyToManyField(related_name='member_projects', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_projects', to=settings.AUTH_USER_MODEL)),
                ('posts', models.ManyToManyField(related_name='projects', to='posts.post')),
            ],
        ),
    ]