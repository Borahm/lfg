from django.db import models


class Post(models.Model):
    text = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    post_picture = models.CharField(max_length=300, default=None, blank=True,)

    project = models.ForeignKey(
        'projects.Project',
        related_name="posts",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="posts",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
