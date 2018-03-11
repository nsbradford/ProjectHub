"""
    projects/serializers.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import serializers

from authentication.serializers import AccountSerializer
from projects.models import Project, Major, Tag


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
        fields = ('id', 'author', 'title', 'description', 'created_at', 'updated_at',
                         'majors', 'tags')
        read_only_fields = ('id', 'created_at', 'updated_at')


    author = AccountSerializer(read_only=True, required=False)
    majors = serializers.SlugRelatedField(
        many=True,
        slug_field='title',
        queryset=Major.objects.all()
    )
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='title',
        queryset=Tag.objects.all()
    )


    def validate(self, data):
        """ Perform object-level validation on all the data. Called automatically
                as part of is_valid(). As per documentation, must return data
                or raise serializers.ValidationError
        """
        valid_majors = Major.objects.all()

        majors = set(data['majors'])

        # The following line is the most `pythonic` way to see if we have any
        # majors that are not real majors.
        if any(major not in valid_majors for major in majors):
            log.error('Major not found - {}'.format(major.title))
            raise serializers.ValidationError('Major(s) not found.')
        return data


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
            raise serializers.ValidationError('Majors must have a title.')

        return data



class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tags for use in a RESTful API"""


    class Meta:
        model = Tag
        fields = ('id', 'title')
        read_only_fields = ('id', 'title')


    def validate(self, data):
        """ Perform object-level validtion on all data.
            title shouldn't be null.
        """
        if data.title is None:
            raise serializers.ValidationError('Tags must have a title.')
        return data
