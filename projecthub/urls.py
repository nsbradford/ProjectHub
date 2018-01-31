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

from authentication.views import AccountViewSet, LoginView, LogoutView, ActivateAccountView
from projects.views import AccountProjectsViewSet, ProjectViewSet
import rest_auth


router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'projects', ProjectViewSet, 'Project')
accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'projects', AccountProjectsViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/activate/$', ActivateAccountView.as_view(), name='activate'),
    url('^.*$', IndexView.as_view(), name='index'),
]