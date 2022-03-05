from rest_framework.views import APIView  # import rest_frameworks APIView
from rest_framework.views import Response  # Response to the user's response
from rest_framework.views import status

from .serializers.common import PostSerializer
from projects.serializers.common import ProjectSerializer
from .serializers.populated import PopulatedPostSerializer
from django.apps import apps

# Exceptions
from django.db import IntegrityError
from rest_framework.exceptions import NotFound, PermissionDenied

# models

from .models import Post
from projects.models import Project

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_post(self, pk):
        try:
            print(type(pk))
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found")

    def get(self, _request, pk):
        post = self.get_post(pk=pk)
        print('post --->', post)
        serialized_post = PopulatedPostSerializer(post)
        return Response(serialized_post.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            post_to_delete = self.get_post(pk=pk)

            if post_to_delete.owner != request.user:
                raise PermissionDenied(detail="Unauthorised")

            post_to_delete.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found")
        except:
            return Response({
                "detail": "Failed to delete Post"
            }, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, pk):
        post_to_update = self.get_post(pk=pk)
        serialized_post = PostSerializer(
            post_to_update, data=request.data)
        try:
            serialized_post.is_valid()
            serialized_post.save()
            return Response(serialized_post.data, status=status.HTTP_202_ACCEPTED)
        except:
            return Response("Unprcessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class PostListView(APIView):

    def post(self, request):

        request.data["owner"] = request.user.id
        print('request.data ----->', request.data)
        project = request.data['project']
        # print(project)
        # projects_to_update = Project.objects.all(id=project)
        # # posts
        # print('project to update',   projects_to_update)
        serialized_post = PostSerializer(data=request.data)
        print('serialized post----->', serialized_post)
        try:
            # project = self.get_object()
            # print('project --->', project)
            serialized_post.is_valid()
            serialized_post.save()
            # serialized_post.projects_project.add(serialized_project)
            print('serialized_post --->', serialized_post.data)
            return Response(serialized_post.data, status=status.HTTP_200_OK)
        except:
            return (Response("Unprocessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY))

  #  project = request.data['project']
  #       print(project)
  #       project_to_update = Project.objects.get(id=project)
  #       print(project_to_update)
  #       # request.data["owner"] = request.user.id
  #       # print('request.data ----->', request.data)
  #       # # serialized_project = ProjectSerializer(project_to_update)
  #       # # print('serialized project----->', serialized_project)
  #       # serialized_post = PostSerializer(data=request.data)
  #       # print('serialized post ----->', serialized_post)
