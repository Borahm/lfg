from django.db import models


class Post(models.Model):
    text = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(
        "projects.Project",
        related_name="project_posts",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owner_posts",
        on_delete=models.CASCADE
    )


# class PostContributor(models.Model):
#     post = models.ForeignKey(
#         Post,
#         related_name="project_posts",
#         on_delete=models.CASCADE
#     )
#     project = models.ForeignKey(
#         "projects.Project",
#         related_name="project_posts",
#         on_delete=models.CASCADE
#     )
