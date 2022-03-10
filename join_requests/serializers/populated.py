from projects.serializers.common import ProjectSerializer
from .common import RequestSerializer
from jwt_auth.serializers.common import UserSerializer


class PopulatedRequestSerializer(RequestSerializer):
    owner = UserSerializer()
