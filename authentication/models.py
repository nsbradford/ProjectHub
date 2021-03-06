"""
    authentication/models.py
    Nicholas S. Bradford
    08-13-17

    Custom user model.
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager

from simple_email_confirmation.models import SimpleEmailConfirmationUserMixin
from django.core.mail import send_mail
from django.template.loader import render_to_string

from django.conf import settings


def send_confirmation_email(email, key):
    proper_url = 'https://www.goprojecthub.com/activate/%s' % key
    msg_html = render_to_string('email-confirm-account.html', {'proper_url': proper_url})
    msg_text = ('We received a request to create an account for %s. \
            Use the following token link confirm: %s' % (email, proper_url))
    send_mail(
        subject='ProjectHub: Confirm your account',
        message=msg_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message = msg_html,
        fail_silently=False,
    )


class AccountManager(BaseUserManager):
    """ A custom Manager is required when creating a custom user model. """

    def create_user(self, email, password=None, **kwargs):
        """ Ensure user has email and username (and password). 
            Normalize the email address by lowercasing the domain part of it.
                (Technically the standard allows case sensitivity in local part/name,
                though most email providers ignore this rule for simplicity.)
        """
        if not email:
            raise ValueError('Users must have a valid email address.')
        # if not password:
        #     raise ValueError('Users must have a valid password.')
        # TODO can add username to the normal arguments
        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')
        if not kwargs.get('first_name'):
            raise ValueError('Users must have a valid first_name.')
        if not kwargs.get('last_name'):
            raise ValueError('Users must have a valid last_name.')
        account = self.model(
            email=self.normalize_email(email),
            username=kwargs.get('username'),
            first_name=kwargs.get('first_name'),
            last_name=kwargs.get('last_name')
        )
        account.set_password(password)
        account.save()
        send_confirmation_email(email, account.confirmation_key)
        return account

    def create_superuser(self, email, password, **kwargs):
        """ Only difference with a normal user is that the superuser has 'is_admin: True' """
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.save()
        return account


class Account(SimpleEmailConfirmationUserMixin, AbstractBaseUser):
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

    # self.is_confirmed property will check if this user's email is confirmed
    # Check https://github.com/mfogel/django-simple-email-confirmation
    #       /blob/develop/simple_email_confirmation/models.py

    objects = AccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __unicode__(self):
        """ Overrides default to provide a more helpful description. """
        return self.email

    def get_full_name(self):
        """ Django convention that should be included, but currently unused. """
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        """ Django convention that should be included, but currently unused. """
        return self.first_name

    def resend_confirmation_email(self):
        send_confirmation_email(self.email, self.confirmation_key)
