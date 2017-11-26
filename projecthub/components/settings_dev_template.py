# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '$6(x*g_2g9l_*g8peb-@anl5^*8q!1w)k&e&2!i)t6$s8kia94'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', True)

# TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = []

# TODO add database login info

# Mailgun login info

EMAIL_HOST_USER = 'postmaster@goprojecthub.com'
EMAIL_HOST_PASSWORD = 'change_me'