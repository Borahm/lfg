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
    )
    # members = models.ManyToManyField(
    #     "jwt_auth.User",
    #     related_name="member_projects",
    #     default=None,
    #     blank=True,
    # )
    # posts = models.ManyToManyField(
    #     "posts.Post",
    #     related_name="projects",
    #     default=None,
    #     blank=True,
    # )
    title = models.CharField(default=None, max_length=100)
    tldr = models.CharField(default=None, max_length=140)
    description = models.TextField(default=None, max_length=1000)
    status = models.CharField(
        default=None, max_length=100, choices=PROJECT_STATUS)
    hero_image = models.CharField(default=None, max_length=500)
    project_images = models.CharField(default=None, max_length=2000)
    # requests = models.ManyToManyField(
    #     "join_requests.Request",
    #     related_name="requested_projects",
    #     default=None,
    #     blank=True,
    # )
    # posts: Foreign key
    # likes: Foreign key
    # comments: Foreign key

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    comment = models.TextField(default=None, max_length=1000)
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owned_comments",
        on_delete=models.CASCADE,
    )
    project = models.ForeignKey(
        Project,
        related_name="owned_comments",
        on_delete=models.CASCADE,
    )
