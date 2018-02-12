"""
	tests/projects/tests.py
	Nicholas S. Bradford
	08-17-17

"""

# from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import Account
from projects.models import Project
from projects import views


class ProjectTests(APITestCase):

    email = 'johndoe@gmail.com'
    username = 'johndoe'
    first_name = 'John'
    last_name = 'Doe'
    password = 'password123'
    author = 'myauthor'
    title = 'mytitle'
    description = 'mydescription'
    majors = []
    tagline = 'This is the tagline for John Doe #1'
    new_title = title + '-edited!'
    new_description = description + '-edited!'
    setup_data = {
                'email': email,
                'username': username,
                'password': password,
                'first_name': first_name,
                'last_name': last_name,
                'tagline': tagline
            }
    project_data = {
        'title': title,
        'description': description,
        'majors': []
    }
    project_data_edited = {
        'title': new_title,
        'description': new_description,
        'majors': []
    }
    accounts_url = '/api/v1/accounts/'
    project_url = '/api/v1/projects/'
    url_activate = '/api/v1/auth/activate/%s'


    def activate_account(self, new_account):
        good_token = new_account.get_confirmation_key()
        post_response = self.client.post(self.url_activate % good_token)
        self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)


    @staticmethod
    def make_project_url(account):
        return ProjectTests.project_url + str(account.pk) + '/'


    def setup_account(self):
        """ Create an account and confirm it is stored properly.
            Returns:
                The created Account.
        """
        self.assertEqual(Account.objects.count(), 0)
        post_response = self.client.post(self.accounts_url, self.setup_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, self.email)
        self.assertEqual(new_account.username, self.username)
        return new_account


    def setup_project(self, new_account, data_modifier=''):
        """ """
        previous_n_projects = Project.objects.count()
        self.assertEqual(Account.objects.count(), 1)
        modified_project_data = dict(self.project_data)
        modified_project_data['title'] = modified_project_data['title'] + data_modifier
        response = self.client.post(self.project_url, modified_project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), previous_n_projects + 1)
        new_project = Project.objects.last()
        self.assertEqual(new_project.author, new_account)
        self.assertEqual(new_project.title, self.title + data_modifier)
        self.assertEqual(new_project.description, self.description)
        # self.assertEqual(new_project.majors.all(), self.majors)


    def setup_account_and_project(self, activate=True):
        """ """
        self.assertEqual(Account.objects.count(), 0)
        new_account = self.setup_account()
        if activate:
            self.activate_account(new_account)
        self.client.login(email=self.email, password=self.password)
        self.setup_project(new_account)
        return new_account


    def test_create_project_must_be_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project_must_be_activated(self):
        """ Get 403 Forbidden if posting from an account without an activated email."""
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project(self):
        """ Ensure we can create a new project object. """
        self.setup_account_and_project()


    def test_delete_project_must_be_authenticated(self):
        """ Can't delete a project when not signed in. """
        new_account = self.setup_account_and_project()
        self.client.logout()
        response = self.client.delete(ProjectTests.make_project_url(new_account))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_delete_project(self):
        """ DELETE a single project. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        response = self.client.delete(ProjectTests.make_project_url(new_account))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Project.objects.all()), 0)


    def test_update_project(self):
        """ PUT to edit a project. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.put(ProjectTests.make_project_url(new_account),
                            self.project_data_edited, format='json')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        new_project = Project.objects.get()
        self.assertEqual(new_project.title, self.new_title)
        self.assertEqual(new_project.description, self.new_description)


    def test_get_single_project(self):
        """ GET a single project by author and project name. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.get(ProjectTests.make_project_url(new_account))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data), 7)
        self.assertEqual(get_response.data['author']['username'], self.username)
        self.assertEqual(get_response.data['title'], self.title)
        self.assertEqual(get_response.data['description'], self.description)
        # self.assertEqual(get_response.data['major'], self.major)
        self.assertIn('created_at', get_response.data)
        self.assertIn('updated_at', get_response.data)


    def test_get_all_projects_by_user(self):
        new_account = self.setup_account_and_project()
        self.setup_project(new_account, '-appendtext')
        self.assertEqual(len(Project.objects.all()), 2)
        get_response = self.client.get('/api/v1/accounts/' + self.username + '/projects/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data), 2) # should return 2 projects
        sorted_projects = sorted(get_response.data, key=lambda x: x.get('title'))
        self.assertEqual(sorted_projects[0]['title'], self.title)
        self.assertEqual(sorted_projects[1]['title'], self.title + '-appendtext')

####### Begin ben's super awesome testing environment which is way better that nick's (TradeMark 2018)
# import json

# from django.core.urlresolvers import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase

# from authentication.models import Account
# from projects.models import Project, Major
# from projects import views


# class ProjectTests(APITestCase):

#     user_correct_payload = {
#         'first_name': 'john',
#         'last_name': 'doe',
#         'username': 'johndoe',
#         'email': 'johndoe@gmail.com',
#         'password': 'password123',
#     }

#     user_wrong_payload = {
#         'first_name': 'jane',
#         'last_name': 'doe',
#         'username': 'janedoe',
#         'email': 'janedoe@gmail.com',
#         'password': 'password1337',
#     }

#     create_project_payload = {
#         'author': 'johndoe',
#         'title': 'mytitle',
#         'description': 'mydescription',
#         'majors': ['Underwater Basket Weaving'],
#     }

#     edit_project_payload = {
#         'author': 'johndoe',
#         'title': 'new title',
#         'description': 'new description',
#         'majors': ['Partying'],
#     }

#     existing_project_payload = {
#         'author': 'johndoe',
#         'title': 'existing title',
#         'description': 'existing description',
#         'majors': ['Underwater Basket Weaving'],
#     }

#     accounts_url = '/api/v1/accounts/'
#     project_url = '/api/v1/projects/'
#     url_activate = '/api/v1/auth/activate/%s'


#     def activate_account(self, new_account):
#         good_token = new_account.get_confirmation_key()
#         post_response = self.client.post(self.url_activate % good_token)
#         self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)

#     @staticmethod
#     def make_project_url(account):
#         return ProjectTests.project_url + str(account.pk) + '/'


#     def setup_account(self):
#         """ Create an account and confirm it is stored properly.
#             Returns:
#                 The created Account.
#         """
#         self.assertEqual(Account.objects.count(), 0)
#         post_response = self.client.post(self.accounts_url, self.setup_data, format='json')
#         self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Account.objects.count(), 1)
#         new_account = Account.objects.get()
#         self.assertEqual(new_account.email, self.email)
#         self.assertEqual(new_account.username, self.username)
#         return new_account


#     def setup_project(self, new_account, data_modifier=''):
#         """ """
#         previous_n_projects = Project.objects.count()
#         self.assertEqual(Account.objects.count(), 1)
#         modified_project_data = dict(self.project_data)
#         modified_project_data['title'] = modified_project_data['title'] + data_modifier
#         response = self.client.post(self.project_url, modified_project_data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Project.objects.count(), previous_n_projects + 1)
#         new_project = Project.objects.last()
#         self.assertEqual(new_project.author, new_account)
#         self.assertEqual(new_project.title, self.title + data_modifier)
#         self.assertEqual(new_project.description, self.description)
#         self.assertEqual(new_project.major, self.major)


#     def setup_account_and_project(self, activate=True):
#         """ """
#         self.assertEqual(Account.objects.count(), 0)
#         new_account = self.setup_account()
#         if activate:
#             self.activate_account(new_account)
#         self.client.login(email=self.email, password=self.password)
#         self.setup_project(new_account)
#         return new_account


#     def test_create_project_must_be_authenticated(self):
#         """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
#         response = self.client.post(self.project_url, self.project_data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#     def get_existing_project_url():
#         return ProjectTests.project_url + str(1) + '/'

#     def setUp(self):
#         """
#         In this setup function, we provide django some definitions of Majors
#         Some existing accounts, and one existing project to test our edits, and
#         deletes on.
#         """
#         Major.objects.create(title='Underwater Basket Weaving')
#         Major.objects.create(title='Partying')
#         # Define a correct User
#         self.account_correct = self.client.post(
#             self.accounts_url,
#             data=self.user_correct_payload,
#             format='json'
#         )
#         # Define a wrong User
#         self.account_wrong = self.client.post(
#             self.accounts_url,
#             data=self.user_wrong_payload,
#             format='json'
#         )

#         # Define an existing project that we can edit and delete
#         self.login_correct()
#         self.project_existing = self.client.post(
#             self.project_url,
#             data=self.existing_project_payload,
#             format='json'
#         )
#         # We need to logout so we allow the tests to specify:
#         # Is there someone even logged in, or who is logged it
#         self.client.logout()

#     def test_create_project_must_be_activated(self):
#         """ Get 403 Forbidden if posting from an account without an activated email."""
#         self.setup_account()
#         self.client.login(email=self.email, password=self.password)
#         response = self.client.post(self.project_url, self.project_data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


#     def test_create_project(self):
#         """ Ensure we can create a new project object. """
#         self.setup_account_and_project()
#     def login_correct(self):
#         """
#         Reusable function for logging in as the correct user
#         """
#         return self.client.login(
#             email=self.user_correct_payload.get('email'),
#             password=self.user_correct_payload.get('password')
#         )

#     def login_wrong(self):
#         """
#         Reusable function for logging in as the wrong user
#         """
#         self.client.login(
#             email=self.user_wrong_payload.get('email'),
#             password=self.user_wrong_payload.get('password')
#         )

#     def test_create_project_successfully(self):
#         """
#         Create a project the traditional way.
#         """
#         self.login_correct()
#         response = self.client.post(
#             self.project_url,
#             self.create_project_payload,
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_create_project_fail_not_logged_in(self):
#         """
#         Anonymous users who attempt to save, should cause a failure.
#         """
#         response = self.client.post(
#             self.project_url,
#             self.create_project_payload,
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_edit_project_successfully(self):
#         """
#         User's who own a project should be allowed to edit all fields (except the author)
#         """
#         self.login_correct()
#         response = self.client.put(
#             ProjectTests.get_existing_project_url(),
#             self.edit_project_payload,
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_edit_project_wrong_user_fail(self):
#         """
#         Other users cannot edit another user's project
#         """
#         self.login_wrong()
#         response = self.client.put(
#             ProjectTests.get_existing_project_url(),
#             self.edit_project_payload,
#             format='json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_delete_project_successfully(self):
#         """
#         User's who own a project should be allowed to delete it
#         """
#         self.login_correct()
#         response = self.client.delete(ProjectTests.get_existing_project_url())
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(len(Project.objects.all()), 0)


#     def test_update_project(self):
#         """ PUT to edit a project. """
#         new_account = self.setup_account_and_project()
#         self.assertEqual(len(Project.objects.all()), 1)
#         get_response = self.client.put(ProjectTests.make_project_url(new_account),
#                             self.project_data_edited, format='json')
#         self.assertEqual(get_response.status_code, status.HTTP_200_OK)
#         new_project = Project.objects.get()
#         self.assertEqual(new_project.title, self.new_title)
#         self.assertEqual(new_project.description, self.new_description)


#     def test_get_single_project(self):
#         """ GET a single project by author and project name. """
#         new_account = self.setup_account_and_project()
#         self.assertEqual(len(Project.objects.all()), 1)
#         get_response = self.client.get(ProjectTests.make_project_url(new_account))
#         self.assertEqual(get_response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(get_response.data), 7)
#         self.assertEqual(get_response.data['author']['username'], self.username)
#         self.assertEqual(get_response.data['title'], self.title)
#         self.assertEqual(get_response.data['description'], self.description)
#         self.assertEqual(get_response.data['major'], self.major)
#         self.assertIn('created_at', get_response.data)
#         self.assertIn('updated_at', get_response.data)

#     def test_delete_project_wrong_user_fail(self):
#         """
#         Other users cannot delete another user's project
#         """
#         self.login_wrong()
#         response = self.client.delete(ProjectTests.get_existing_project_url())
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_read_project_success(self):
#         """
#         Anyone can read projects
#         """
#         response = self.client.get(ProjectTests.get_existing_project_url())
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_json = json.loads(response.content)
#         # We are expecting an exact response.. We can only control the following fields
#         self.assertEquals(response_json.get('id'), 1)
#         self.assertEquals(response_json.get('title'), self.existing_project_payload.get('title'))
#         self.assertEquals(response_json.get('description'), self.existing_project_payload.get('description'))
#         self.assertEquals(response_json.get('majors'), self.existing_project_payload.get('majors'))

#     def test_get_all_projects_by_user(self):
#         """
#         Anyone can see an aggregated list of all of a single user's projects
#         """
#         response = self.client.get(
#             '/api/v1/accounts/' +
#             self.user_correct_payload.get('username') +
#             '/projects/'
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)