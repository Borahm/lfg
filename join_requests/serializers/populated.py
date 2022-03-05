# common review serializer will be extended
from .common import RequestSerializer
# user serializer will be used to populate the owner field
from join_requests.serializers.common import RequestSerializer


class PopulatedRequestSerializer(RequestSerializer):
    owner = RequestSerializer()
