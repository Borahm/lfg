from django.db import models


# Create your models here.


class Project(models.Model):
    PROJECT_STATUS = [
        ('', 'Select'),
        ('IDEATING', 'Ideating'),
        ('EXPLORING', 'Exploring'),
        ('BUILDING', 'Building'),
    ]
    owner = models.ForeignKey(
        "jwt_auth.User", related_name="owned_projects", on_delete=models.CASCADE)
    members = models.ManyToManyField(
        "jwt_auth.User",
        related_name="member_projects",
    )
    posts = models.ManyToManyField(
        "posts.Post",
        related_name="projects",
    )
    title = models.CharField(default=None, max_length=100)
    tldr = models.CharField(default=None, max_length=140)
    description = models.TextField(default=None, max_length=1000)
    status = models.CharField(
        default=None, max_length=100, choices=PROJECT_STATUS)
    hero_image = models.CharField(default=None, max_length=500)
    project_images = models.CharField(default=None, max_length=2000)
    # posts: Foreign key
    # likes: Foreign key
    # comments: Foreign key

    def __str__(self):
        return f"{self.title}"
