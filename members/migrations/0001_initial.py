# Generated by Django 4.0.3 on 2022-03-08 00:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=300)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='owner_members', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='project_members', related_query_name='project_members', to='projects.project')),
            ],
        ),
    ]
