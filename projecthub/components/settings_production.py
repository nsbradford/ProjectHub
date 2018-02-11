"""
    settings_production.py

    Django settings for projecthub project.

    For more information on this file, see
    https://docs.djangoproject.com/en/1.7/topics/settings/

    For the full list of settings and their values, see
    https://docs.djangoproject.com/en/1.7/ref/settings/

    Quick-start development settings - unsuitable for production
    See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/
    Build paths inside the project like this: os.path.join(BASE_DIR, ...)
"""

import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', None)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', False)
# TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = ['.goprojecthub.com']

# HTTPS configs, proxy ssl header needed for Heroku

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# email with Mailgun

EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

ANYMAIL = {
    'MAILGUN_API_KEY': os.environ.get('MAILGUN_API_KEY', None),
    'MAILGUN_SENDER_DOMAIN': 'goprojecthub.com',
}


EMAIL_BACKEND = 'anymail.backends.mailgun.EmailBackend'
DEFAULT_FROM_EMAIL = 'postmaster@goprojecthub.com'
FIXTURE_DIRS = (
   os.path.join(BASE_DIR, 'fixtures'),
)

# TODO Django: from which email addresses to send messages

# DEFAULT_FROM_EMAIL =
# SERVER_EMAIL =

# TODO logging and notifications of server errors

# LOGGING = []
# ADMINS = [] # notified of 500 errors
# MANAGERS = [] # notified of 404 errors

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'compressor',
    'authentication',
    'projects',
    'simple_email_confirmation',
    'anymail',
    'django_nose'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'projecthub.urls'

WSGI_APPLICATION = 'projecthub.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

# TODO switch from SQLite to Postgres

import dj_database_url

DATABASES = {}
DATABASES['default'] =  dj_database_url.config()


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'staticfiles'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

COMPRESS_ENABLED = os.environ.get('COMPRESS_ENABLED', False)

# TEMPLATE_DIRS = (
#     os.path.join(BASE_DIR, 'templates'),
# )

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# change the user model from User to our custom Account
AUTH_USER_MODEL = 'authentication.Account'


# based on https://stackoverflow.com/questions/5739830/simple-log-to-file-example-for-django-1-3
# TODO don't need both info and debug logs
SITE_ROOT = '.'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
    },
    'handlers': {
        'null': {
            'level':'DEBUG',
            'class':'logging.NullHandler',
        },
        'logfile': {
            'level':'DEBUG',
            'class':'logging.handlers.RotatingFileHandler',
            'filename': SITE_ROOT + "/logfile",
            'maxBytes': 50000,
            'backupCount': 2,
            'formatter': 'standard',
        },
        'console':{
            'level':'INFO',
            'class':'logging.StreamHandler',
            'formatter': 'standard'
        },
    },
    'loggers': {
        'django': {
            'handlers':['console'],
            'propagate': True,
            'level':'WARN',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'projecthub': {
            'handlers': ['console', 'logfile'],
            'level': 'DEBUG',
        },
    }
}

# Django testing with Nose
TEST_RUNNER = "django_nose.NoseTestSuiteRunner"
NOSE_ARGS = ['--nocapture',
             '--nologcapture',]

# TEST

print "\nProduction env tests..."
if not SECRET_KEY: print 'WARNING: SECRET_KEY not set'
if not ANYMAIL['MAILGUN_API_KEY']: print 'WARNING: MAILGUN_API_KEY not set'
if DEBUG: print 'WARNING: running in DEBUG mode'
print ''
