"""
	authentication/models.py
	Nicholas Bradford
	8-13-17

	Custom user model.
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager


class AccountManager(BaseUserManager):
	""" A custom Manager is required when creating a custom user model.	"""

	def create_user(self, email, password=None, **kwargs):
		""" Ensure user has email and username (and password). 
			Normalize the email address by lowercasing the domain part of it.
				(Technically the standard allows case sensitivity in local part/name,
				though most email providers ignore this rule for simplicity.)
		"""
		if not email:
			raise ValueError('Users must have a valid email address.')
		if not kwargs.get('username'):
			raise ValueError('Users must have a valid username.')
		account = self.model(
			email=self.normalize_email(email), username=kwargs.get('username')
		)
		account.set_password(password)
		account.save()
		return account

	def create_superuser(self, email, password, **kwargs):
		""" Only difference with a normal user is that the superuser has 'is_admin: True' """
		account = self.create_user(email, password, **kwargs)
		account.is_admin = True
		account.save()
		return account


class Account(AbstractBaseUser):
	""" Extend the AbstractBaseUser so that we can add custom properties while retaining
			benefits of session manaagement, password hashing, etc. 
		NOTE: in order for django to switch to using our custom class for superusers, must
			add to settings.py: AUTH_USER_MODEL = 'authentication.Account'
		To serialize this to JSON, we use our custom serializers/AccountSerializer.

		The username field is changed to the 'email' instead of default 'username',
			though we still enforce unique usernames. 
		First and last names names are optional, as are taglines. 
		The 'created_at' (set to current time) and 'updated_at' (reset whenever a change 
			is made) are handled automatically.
		The 'objects' is how Django gets model instances (i.e. Account.objects.all()).
	"""

	email = models.EmailField(unique=True)
	username = models.CharField(max_length=40, unique=True)
	first_name = models.CharField(max_length=40, blank=True)
	last_name = models.CharField(max_length=40, blank=True)
	tagline = models.CharField(max_length=140, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	is_admin = models.BooleanField(default=False)

	objects = AccountManager()
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def __unicode__(self):
		""" Overrides default to provide a more helpful description. """
		return self.email

	def get_full_name(self):
		""" Django convention that should be included, but currently unused. """
		return ' '.join([self.first_name, self.last_name])

	def get_short_name(self):
		""" Django convention that should be included, but currently unused. """
		return self.first_name
