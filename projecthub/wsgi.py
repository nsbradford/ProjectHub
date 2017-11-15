"""
WSGI config for projecthub project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/

We've switched to using WhiteNoise, here's the old version using Cling:
	from django.core.wsgi import get_wsgi_application
	from dj_static import Cling
	application = Cling(get_wsgi_application())
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "projecthub.settings")

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

application = get_wsgi_application()
application = DjangoWhiteNoise(application)