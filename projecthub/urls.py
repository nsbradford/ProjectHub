"""
    urls.py
    Nicholas S. Bradford
    8-12-17

    Links Django URLs to Views.
    Routers allow for cleaner code and nesting.
    The nested account router allows for the API to get all a user's projects.

"""

from django.conf.urls import url, include
from projecthub.views import IndexView
from rest_framework_nested import routers

<<<<<<< HEAD
from authentication.views import AccountViewSet, LoginView, LogoutView
from authentication.views import ActivateAccountView, ResendEmailView
from projects.views import AccountProjectsViewSet, ProjectViewSet
=======
from authentication.views import AccountViewSet
from authentication.views import LoginView
from authentication.views import LogoutView
from projects.views import AccountProjectsViewSet, ProjectViewSet, MajorViewSet
>>>>>>> Adding Majors to models, and loading majors into SQL



router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'majors', MajorViewSet)
router.register(r'projects', ProjectViewSet, base_name='Project')
accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'projects', AccountProjectsViewSet)


urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/activate/(?P<key>\w+)$', ActivateAccountView.as_view(), name='activate'),
    url(r'^api/v1/auth/resend/$', ResendEmailView.as_view(), name='resendEmail'),
    url('^.*$', IndexView.as_view(), name='index'),
]