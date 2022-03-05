from rest_framework.views import APIView  # import rest_frameworks APIView
from rest_framework.views import Response  # Response to the user's response
from rest_framework.views import status

from .serializers.common import RequestSerializer
from .serializers.populated import PopulatedRequestSerializer

# Exceptions
from rest_framework.exceptions import NotFound, PermissionDenied

# models

from .models import Request

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class RequestDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_request(self, pk):
        try:
            return Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise NotFound(detail="request not found")

    def get(self, _request, pk):
        request = self.get_request(pk=pk)
        serialized_request = PopulatedRequestSerializer(request)
        return Response(serialized_request.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            request_to_delete = self.get_request(pk=pk)

            if request_to_delete.owner != request.user:
                raise PermissionDenied(detail="Unauthorised")

            request_to_delete.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Request.DoesNotExist:
            raise NotFound(detail="request not found")
        except:
            return Response({
                "detail": "Failed to delete request"
            }, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, pk):
        request_to_update = self.get_request(pk=pk)
        serialized_request = RequestSerializer(
            request_to_update, data=request.data)
        try:
            serialized_request.is_valid()
            serialized_request.save()
            return Response(serialized_request.data, status=status.HTTP_202_ACCEPTED)
        except:
            return Response("Unprcessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class RequestListView(APIView):

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
