"""
	authentication/serializers.py
	Nicholas S. Bradford
	08-14-17

"""

from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from authentication.models import Account


class AccountSerializer(serializers.ModelSerializer):
	""" Serialize Account for use with RESTful API.
		The 'password' and 'confirm_password' fields are declared explicitly so
			they can be set to required=False (no need to always update password),
			and write_only=True (so that password, even hashed and salted, shouldn't
			be visible to the client in the AJAX response)
	"""

	password = serializers.CharField(write_only=True, required=False)
	confirm_password = serializers.CharField(write_only=True, required=False)


	class Meta:
		""" Defines metadata for our serializer to operate on. 
			Set 'model', 'fields', and 'read_only_fields' for it to work.
				Fields such as 'is_superuser' should not be visible to client.
		"""

		model = Account
		fields = ('id', 'email', 'username', 'created_at', 'updated_at',
					'first_name', 'last_name', 'tagline', 'password',
					'confirm_password',)
		read_only_fields = ('created_at', 'updated_at',)


		def create(self, validated_data):
			""" Unpack and turn JSON data dict into a Python object. """
			return Account.objects.create(**validated_data)


		def update(self, instance, validated_data):
			""" Update username and tagline if present. 
				If updating password, validate that both password entries match,
					and then update the session authorization given the new
					password (so they don't have to login again). 
					User.set_password(raw_password) handles secure salting/hashing.
				TODO password validation: should enforce minimum length,
					lowercase and uppercase letters, disallowed insecure strings
					like 'password', etc. (there are libraries for this)
				Args:
					instance (Account): object to update
					validated_data (dict): JSON data for updated fields
				Returns: 
					instance (Account): updated object
			"""
			instance.username = validated_data.get('username', instance.username)
			instance.tagline = validated_data.get('tagline', instance.tagline)
			instance.save()

			password = validated_data.get('password', None)
			confirm_password = validated_data.get('confirm_password', None)
			if password and confirm_password and password == confirm_password:
				instance.set_password(password)
				instance.save()
			update_session_auth_hash(self.context.get('request'), instance)

			return instance