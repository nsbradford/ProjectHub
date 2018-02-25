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
from projects.models import Project, Major, Tag
from projects import views


class ProjectTests(APITestCase):

    # email = 'johndoe@wpi.edu'
    # username = 'johndoe'
    # first_name = 'John'
    # last_name = 'Doe'
    # password = 'password123'
    author = 'myauthor'
    title = 'mytitle'
    description = 'mydescription'
    # majors = ['Underwater Basket Weaving', 'Computer Science']
    tags = ['Academic', 'Startup']
    # tagline = 'This is the tagline for John Doe #1'
    new_title = title + '-edited!'
    new_description = description + '-edited!'
    setup_data = {
                'email': 'johndoe@wpi.edu',
                'username': 'johndoe',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'tagline': 'This is the tagline for John Doe #1'
            }
    bad_user = {
                'email': 'bad@wpi.edu',
                'username': 'badguy',
                'password': 'hackerman666',
                'first_name': 'Bad',
                'last_name': 'Guy',
                'tagline': 'I am evil'
            }
    project_data = {
        'title': title,
        'description': description,
        'majors': ['Underwater Basket Weaving', 'Computer Science'],
        'tags': tags
    }
    project_data_edited = {
        'title': new_title,
        'description': new_description,
        'majors': ['Underwater Basket Weaving', 'Computer Science'],
        'tags': tags
    }
    accounts_url = '/api/v1/accounts/'
    project_url = '/api/v1/projects/'
    url_activate = '/api/v1/auth/activate/%s'


    @staticmethod
    def make_project_url(project):
        return ProjectTests.project_url + str(project.pk) + '/'


    def activate_account(self, new_account):
        good_token = new_account.get_confirmation_key()
        post_response = self.client.post(self.url_activate % good_token)
        self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)


    def login(self, payload=setup_data):
        self.client.login(email=payload['email'], password=payload['password'])


    def setUp(self):
        self.setup_account()
        major1 = Major.objects.create(title='Underwater Basket Weaving')
        major2 = Major.objects.create(title='Computer Science')
        tag1 = Tag.objects.create(title='Academic')
        tag2 = Tag.objects.create(title='Startup')


    def setup_account(self, payload=setup_data):
        """ Create an account."""
        Account.objects.create_user(
                            email=payload['email'],
                            username=payload['username'],
                            password=payload['password'],
                            first_name=payload['first_name'],
                            last_name=payload['last_name'],
                            tagline=payload['tagline'])



    def setup_project(self, new_account, data_modifier='', create_data=True):
        """ Create a new project. """

        project = Project.objects.create(
                                author=new_account,
                                title=self.project_data['title'],
                                description=self.project_data['description'],
                            )
        project.majors = Major.objects.all()
        project.tags = Tag.objects.all()
        return project


    def create_project(self, new_account, data_modifier='', create_data=True):
        """ Create a new project and confirm the fields are set correct. """
        previous_n_projects = Project.objects.count()
        self.assertEqual(Account.objects.count(), 1)
        modified_project_data = dict(self.project_data)
        modified_project_data['title'] += data_modifier
        response = self.client.post(self.project_url, modified_project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), previous_n_projects + 1)
        new_project = Project.objects.last()
        self.assertEqual(new_project.author, new_account)
        self.assertEqual(new_project.title, self.title + data_modifier)
        self.assertEqual(new_project.description, self.description)
        self.assertQuerysetEqual(new_project.majors.all(), map(repr, Major.objects.all()), ordered=False)
        self.assertQuerysetEqual(new_project.tags.all(), map(repr, Tag.objects.all()), ordered=False)


    def activate_login_and_setup_project(self):
        """ Activate account, login, and setup a new project. """
        new_account = Account.objects.last()
        self.activate_account(new_account)
        self.login()
        self.setup_project(new_account)
        return new_account


    # test CREATE

    def test_create_project(self):
        """ Ensure we can create a new project object. """
        new_account = Account.objects.last()
        self.activate_account(new_account)
        self.login()
        self.create_project(new_account)


    def test_create_project_fails_when_not_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project_fails_when_not_activated(self):
        """ Get 403 Forbidden if posting from an account without an activated email."""
        self.login()
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    # test READ

    def test_get_single_project(self):
        """ GET a single project by author and project name. """
        new_account = Account.objects.last()
        self.setup_project(new_account)
        new_project = Project.objects.last()
        get_response = self.client.get(ProjectTests.make_project_url(new_project))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)

        # could do this with json.loads(response.content) as well
        self.assertEqual(len(get_response.data), 8)
        self.assertEqual(get_response.data['author']['username'], self.setup_data['username'])
        self.assertEqual(get_response.data['title'], self.title)
        self.assertEqual(
            sorted(get_response.data['majors']), 
            sorted(map(unicode, self.project_data['majors']))
        )
        self.assertEqual(
            sorted(get_response.data['tags']), 
            sorted(map(unicode, self.tags))
        )


    def test_get_all_projects_by_user(self):
        self.activate_login_and_setup_project()
        new_account = Account.objects.last()
        self.create_project(new_account, '-appendtext', create_data=False)
        self.assertEqual(len(Project.objects.all()), 2)
        get_response = self.client.get('/api/v1/accounts/' + self.setup_data['username'] + '/projects/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data), 2)
        sorted_projects = sorted(get_response.data, key=lambda x: x.get('title'))
        self.assertEqual(sorted_projects[0]['title'], self.title)
        self.assertEqual(sorted_projects[1]['title'], self.title + '-appendtext')


    # test UPDATE

    def test_update_project(self):
        """ PUT to edit a project. """
        self.activate_login_and_setup_project()
        new_project = Project.objects.last()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.put(ProjectTests.make_project_url(new_project),
                            self.project_data_edited, format='json')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        new_project = Project.objects.last()
        self.assertEqual(new_project.title, self.new_title)
        self.assertEqual(new_project.description, self.new_description)


    def test_update_project_fails_for_wrong_user(self):
        new_account = Account.objects.last()
        new_project = self.setup_project(new_account)
        self.setup_account(payload=self.bad_user)
        self.login(payload=self.bad_user)
        put_response = self.client.put(ProjectTests.make_project_url(new_project),
                    self.project_data_edited, format='json')
        self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)


    # test DESTROY

    def test_delete_project(self):
        """ DELETE a single project. """
        self.activate_login_and_setup_project()
        new_project = Project.objects.last()
        self.assertEqual(len(Project.objects.all()), 1)
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Project.objects.all()), 0)


    def test_delete_project_fails_when_not_authenticated(self):
        """ Can't delete a project when not signed in. """
        new_account = Account.objects.last()
        self.setup_project(new_account)
        new_project = Project.objects.last()
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_delete_project_fails_for_wrong_user(self):
        """ Can't delete the project of another user. """
        new_account = Account.objects.last()
        new_project = self.setup_project(new_account)
        self.setup_account(payload=self.bad_user)
        self.login(payload=self.bad_user)
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)





















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


#     def login_correct(self):
#         """
#         Reusable function for logging in as the correct user
#         """
#         return self.client.login(
#             email=self.user_correct_payload.get('email'),
#             password=self.user_correct_payload.get('password')
#         )


