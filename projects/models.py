from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import ArrayField


# Create your models here.


class Project(models.Model):
    PROJECT_STATUS = [
        ('', 'Select'),
        ('IDEATING', 'Ideating'),
        ('EXPLORING', 'Exploring'),
        ('BUILDING', 'Building'),
    ]
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owned_projects",
        on_delete=models.CASCADE,
        default=None
    )
    members = models.ManyToManyField(
        "jwt_auth.User",
        related_name="member_projects",
        default=None,
        blank=True,
    )
    title = models.CharField(default=None, max_length=100)
    tldr = models.CharField(default=None, max_length=140)
    description = models.TextField(default=None, max_length=1000)
    status = models.CharField(
        default=None, max_length=100, choices=PROJECT_STATUS)
    hero_image = models.CharField(default=None, max_length=500)
    project_images = models.CharField(default=None, max_length=2000)

    def __str__(self):
        return f"{self.title}"


class Post(models.Model):
    text = models.TextField(default=None, max_length=1000)
    project = models.ForeignKey(
        Project,
        related_name="written_posts",
        related_query_name="written_posts",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owned_posts",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
