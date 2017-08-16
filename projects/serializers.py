from rest_framework import serializers

from authentication.serializers import AccountSerializer
from projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Project

        fields = ('id', 'author', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(ProjectSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
