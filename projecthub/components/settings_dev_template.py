# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '$6(x*g_2g9l_*g8peb-@anl5^*8q!1w)k&e&2!i)t6$s8kia94'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', True)

# TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = []

# Mailgun login info

EMAIL_HOST_USER = 'postmaster@goprojecthub.com'
EMAIL_HOST_PASSWORD = 'change_me'


# SSL: must disable when developing locally

CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Postgres - if you want to run a local Postgres server to be more like the Prod environment
DATABASES = {} 
# DATABASES['default'] = dj_database_url.config('postgres://USERNAME:PASSWORD@HOSTADDRESS:HOSTPORT/DATABASENAME')
# DATABASES = {
#     'default': dj_database_url.config{
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'mydatabase',
#         'USER': 'mydatabaseuser',
#         'PASSWORD': 'mypassword',
#         'HOST': '127.0.0.1',
#         'PORT': '5432',
#     }
# }

# SQLite
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
    )
}