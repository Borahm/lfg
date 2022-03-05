# APIView - default view class to extend
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
# get_user_model returns active User model
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .serializers.common import UserSerializer, UserUpdateSerializer
from datetime import datetime, timedelta
import jwt
from django.conf import settings

from rest_framework.exceptions import NotFound


# User model
User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        user_to_create = UserSerializer(data=request.data)
        try:
            user_to_create.is_valid()
            user_to_create.save()
            return Response(user_to_create.data, status=status.HTTP_201_CREATED)
        except:
            return Response("Failed to create user", status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class LoginView(APIView):

    def post(self, request):
        print(request.data)
        try:
            user_to_login = User.objects.get(email=request.data.get('email'))
        except User.DoesNotExist:
            return PermissionDenied(detail="Unauthorised")

        if not user_to_login.check_password(request.data.get('password')):
            return PermissionDenied(detail="Unauthorised")

        dt = datetime.now() + timedelta(days=7)  # today + 7 days for the expiry
        # strftime with %s converts to a date string of seconds, which we then convert to an int
        print('DT ----->', int(dt.strftime('%s')))

        # create the token
        # first arg is the payload - we'll add our id as a sub and the dt variable above as the expiry
        # second arg is the secret key (from settings.py)
        # third arg is the algorithm (string)
        token = jwt.encode({
            'sub': user_to_login.id,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, 'HS256')
        print('TOKEN ----->', token)

        # print(user_to_login.id)
        return Response({
            'token': token,
            'message': f"Welcome back {user_to_login.first_name}"
        }, status.HTTP_202_ACCEPTED)


class UserDetailView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")

    def get(self, _request, pk):
        user = self.get_user(pk=pk)
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user_to_update = self.get_user(pk=pk)
        serialized_user = UserUpdateSerializer(
            user_to_update, data=request.data)

        try:
            serialized_user.is_valid()
            serialized_user.save()
            return Response(serialized_user.data, status=status.HTTP_202_ACCEPTED)
        except:
            return Response("Unprocessable entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)
