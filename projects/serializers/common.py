# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
from jwt_auth.serializers.common import UserSerializer
# import Project model its now up a level so we write ..models.models
from ..models import Project, Post


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = Post
        fields = '__all__'
