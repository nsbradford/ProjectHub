"""
    projects/serializers.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import serializers

from authentication.serializers import AccountSerializer
from projects.models import Project, Major

import logging
log = logging.getLogger('projecthub')
log.debug('!!!!!!')


class ProjectSerializer(serializers.ModelSerializer):
    """ Serialize Project for use with RESTful API.
        When serializing, we want to include all of the author's information
            (a nested relationship). Set to read_only so there are no updates
            to the Account, and required=False so we can set the author
            automatically (this means we also need to add 'author' to
            the validation exclusions)
        TODO: only serialize essential Account data; unnecessary to send all.
    """

    class Meta:
        """ Meta class configuring serializer. """
        model = Project
        fields = ('id', 'author', 'title', 'description', 'created_at', 'updated_at', 'major')
        read_only_fields = ('id', 'created_at', 'updated_at')

    author = AccountSerializer(read_only=True, required=False)
    # majors = serializers.SlugRelatedField(
    #         many=True,
    #         slug_field='title',
    #         queryset=Major.objects.all()
    #     )

    def validate(self, data):
        """ Perform object-level validation on all the data. Called automatically
                as part of is_valid(). As per documentation, must return data
                or raise serializers.ValidationError
        """
        valid_majors = set('CS, RBE')
        majors = set(data['major'])
        log.debug('valid: {}\t actual: {}'.format(valid_majors, majors))
        if False:   # TODO finish validating the list of majors
            raise serializers.ValidationError('Must supply password.')
        return data

    class Meta:
        """ Meta class configuring serializer. """
        model = Project
        fields = ('id', 'author', 'title', 'description', 'created_at',
                        'updated_at', 'majors')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        """ Add 'author' to validation exclusions, because we'll be setting it
                automatically.
        """
        exclusions = super(ProjectSerializer, self).get_validation_exclusions()
        return exclusions + ['author']


class MajorSerializer(serializers.ModelSerializer):
    """Serializer for Majors for use in a RESTful API"""

    class Meta:
        model = Major
        fields = ('id', 'title')
        read_only_fields = ('id', 'title')

    def validate(self, data):
        """ Perform object-level validtion on all data.
            titles shouldn't be null.
        """
        if data.title is None:
            raise serializers.ValidationError('Major\'s must have a title.')

        return data
