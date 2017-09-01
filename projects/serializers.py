"""
    projects/serializers.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import serializers

from authentication.serializers import AccountSerializer
from projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """ Serialize Project for use with RESTful API.
        When serializing, we want to include all of the author's information
            (a nested relationship). Set to read_only so there are no updates
            to the Account, and required=False so we can set the author 
            automatically (this means we also need to add 'author' to 
            the validation exclusions)
        TODO: only serialize essential Account data; unnecessary to send all.
    """

    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        """ Meta class configuring serializer. """
        model = Project
        fields = ('id', 'author', 'title', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        """ Add 'author' to validation exclusions, because we'll be setting it
                automatically. 
        """
        exclusions = super(ProjectSerializer, self).get_validation_exclusions()
        return exclusions + ['author']
