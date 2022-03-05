# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
# import Project model its now up a level so we write ..models.models
from ..models import Project, Comment


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
