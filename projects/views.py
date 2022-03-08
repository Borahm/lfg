from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from django.db import IntegrityError

from .models import Project
from .serializers.common import ProjectSerializer
from .serializers.populated import PopulatedProjectSerializer

from rest_framework.exceptions import NotFound, PermissionDenied

# Permissions classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class ProjectListView(APIView):
    # This specifies the permissions classes a view should use - tuple with trailing comma
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, _request):
        projects = Project.objects.all()
        serialized_projects = PopulatedProjectSerializer(
            projects, many=True)
        print('Projects ------->', projects)
        print('serialized_projects ------->', serialized_projects)
        return Response(serialized_projects.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data["owner"] = request.user.id
        request.data["project_members"] = request.user.id
        print('request user --->', request.user.id)
        print('request_auth---->', request.auth)
        # print('request data owner --->', request.data)
        serialized_data = ProjectSerializer(
            data=request.data, )  # Get the data from the request and store in serialized_data

        print('serializez members---->', serialized_data)
        try:
            serialized_data.is_valid()  # validate
            # save to database if valid
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AssertionError as e:
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response("Unprocessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class ProjectDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_project(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise NotFound(detail="Project not found")

    def get(self, _request, pk):
        project = self.get_project(pk=pk)
        serialized_project = PopulatedProjectSerializer(project)
        return Response(serialized_project.data, status=status.HTTP_200_OK)

    def delete(self, _request, pk):
        project = self.get_project(pk=pk)
        project.delete()
        return Response(status=status.HTTP_204_)

    def put(self, request, pk):
        project_to_update = self.get_project(pk=pk)
        serialized_project = ProjectSerializer(
            project_to_update, data=request.data)
        try:
            if project_to_update.owner.id != request.user.id:
                raise PermissionDenied(detail="Unauthorised")
            serialized_project.is_valid()
            serialized_project.save()
            return Response(serialized_project.data, status=status.HTTP_202_ACCEPTED)
        except:
            return Response("Unprcessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)
