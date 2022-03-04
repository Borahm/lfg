from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
import jwt
import os


# importing settings that also include the secret key
from django.conf import settings

# User model
User = get_user_model()


class JWTAuthentication(BasicAuthentication):

    def authentication(self, request):
        # Get the token from the header
        header = request.headers.get('Authorization')

        if not header:
            return None

        if not header.startswith('Bearer'):
            raise PermissionDenied(detail="Invalid auth token format")

        # Remove Bearer, so that we just have th token
        token = header.replace('Bearer', '')

        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=['HS256'])

            # Find the user through the payload
            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidTokenError as error:
            print(error)
            raise PermissionDenied(detail="Invalid token")
        except User.DoesNotExist as error:
            print(error)
            raise PermissionDenied(detail="User Does not Exist")

        # authenticate() specifies we need to return a tuple of user and auth
        return (user, token)
