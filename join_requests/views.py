from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Request
from .serializers.common import RequestSerializer, RequestSerializer
from .serializers.populated import PopulatedRequestSerializer

from rest_framework.exceptions import NotFound, PermissionDenied

# Permissions classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class RequestDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_data(self, pk):
        try:
            return Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise NotFound(detail="request not found")

    def get(self, _request, pk):
        request = self.get_data(pk=pk)
        serialized_request = PopulatedRequestSerializer(request)
        return Response(serialized_request.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            request_to_delete = self.get_data(pk=pk)

            # print(str(request_to_delete))
            # print(request.user.id)
            if request_to_delete.project.owner.id == request.user.id:
                request_to_delete.delete()
            elif request_to_delete.owner.id == request.user.id:
                request_to_delete.delete()
            else:
                raise PermissionDenied(detail="Unauthorised")

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Request.DoesNotExist:
            raise NotFound(detail="request not found")
        except:
            return Response({
                "detail": "Failed to delete request"
            }, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, pk):
        request_to_update = self.get_data(pk=pk)
        serialized_request = RequestSerializer(
            request_to_update, data=request.data)
        try:
            serialized_request.is_valid()
            serialized_request.save()
            return Response(serialized_request.data, status=status.HTTP_202_ACCEPTED)
        except:
            return Response("Unprcessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class RequestListView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_data(self, pk):
        try:
            return Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise NotFound(detail="request not found")

    def get(self, _request, pk):
        request = self.get_data(pk=pk)
        serialized_request = PopulatedRequestSerializer(request)
        return Response(serialized_request.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data["owner"] = request.user.id
        print(request.data)
        serialized_request = RequestSerializer(data=request.data)
        print(serialized_request)
        try:
            serialized_request.is_valid()
            serialized_request.save()
            print(serialized_request.data)
            return Response(serialized_request.data, status=status.HTTP_200_OK)
        except:
            return (Response("Unprocessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY))
