from rest_framework.views import APIView  # import rest_frameworks APIView
from rest_framework.views import Response  # Response to the user's response
from rest_framework.views import status

from .serializers.common import PostSerializer
from .serializers.populated import PopulatedPostSerializer

# Exceptions
from django.db import IntegrityError
from rest_framework.exceptions import NotFound, PermissionDenied

# models

from .models import Post

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_post(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found")

    def get(self, _request, pk):
        post = self.get_post(pk=pk)
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


class PostListView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def post(self, request):
        request.data["owner"] = request.user.id
        print(request.data)
        serialized_post = ProjectSerializer(data=request.data)
        print(serialized_post)
        try:
            serialized_post.is_valid()
            serialized_post.save()
            print(serialized_post.data)
            return Response(serialized_post.data, status=status.HTTP_200_OK)
        except:
            return (Response("Unprocessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY))
