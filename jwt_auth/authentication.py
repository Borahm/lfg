from django.conf import settings
# Django's default authentication - we'll extend this
from rest_framework.authentication import BasicAuthentication
#  exception when user isn't auth'd
from rest_framework.exceptions import PermissionDenied
# importing this to get the active User model
from django.contrib.auth import get_user_model
from django.conf import settings  # imports settings that also includes secret key
import jwt  # import jwt

# User model
User = get_user_model()


class JWTAuthentication(BasicAuthentication):

    def authenticate(self, request):
        # Get the token from the header
        header = request.headers.get('Authorization')

        if not header:
            return None

        if not header.startswith('Bearer'):
            raise PermissionDenied(detail="Invalid Token Format")

        # Remove Bearer, so that we just have th token
        token = header.replace('Bearer ', '')

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

        return (user, token)
