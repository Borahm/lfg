# common review serializer will be extended
from .common import RequestSerializer
# user serializer will be used to populate the owner field
from join_requests.serializers.common import RequestSerializer
from jwt_auth.serializers.common import UserSerializer


class PopulatedRequestSerializer(RequestSerializer):
    owner = UserSerializer()
