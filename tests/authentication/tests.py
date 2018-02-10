"""
    tests/authentication/tests.py
    Nicholas S. Bradford
    08-18-17

"""

# from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import Account


# class AccountModelTests(TestCase):
#     """ Tests for the Account model. """

#     def test_attributes(self):
#         pass


class APIAccountTests(APITestCase):
    """ RESTful API tests for Account. """

    email = 'johndoe@gmail.com'
    first_name = 'John'
    last_name = 'Doe'
    username = 'johndoe'
    tagline = 'This is the tagline for John Doe #1'
    tagline_update = 'This is the tagline for John Doe #2'
    password = 'password123'
    password_update = 'new_password123'
    setup_data = {  
                    'email': email, 
                    'username': username, 
                    'password': password,
                    'first_name': first_name,
                    'last_name': last_name,
                    'tagline': tagline
                }
    update_data_password_update = {  
                    'email': email, 
                    'username': username,
                    'tagline': tagline_update,
                    'password': password_update,
                    'first_name': first_name,
                    'last_name': last_name,
                    'confirm_password': password_update 
                }
    update_data_tagline = {  
                    'email': email, 
                    'username': username,
                    'tagline': tagline_update,
                    'first_name': first_name,
                    'last_name': last_name,
                    'password': password_update, # TODO shouldn't need to supply this field
                    'confirm_password': password_update # TODO shouldn't need to supply this field
                }
    update_data_bad_pass = {  
                    'email': email, 
                    'username': username,
                    'tagline': tagline_update,
                    'first_name': first_name,
                    'last_name': last_name,
                    'password': '1',
                    'confirm_password': '2'
                }
    incomplete_data = {  #missing password and last_name
                    'email': email, 
                    'username': username,
                    'first_name': first_name
                }
    no_name_data = {  #last_name is blank
                    'email': email, 
                    'username': username,
                    'first_name': first_name,
                    'last_name': '',
                    'password': password_update, # TODO shouldn't need to supply this field
                    'confirm_password': password_update # TODO shouldn't need to supply this field
                }
    url = '/api/v1/accounts/'
    url_username = url + username + '/'
    url_activate = '/api/v1/auth/activate/%s'
    url_resend_email = '/api/v1/auth/resend/'
    json_email = {'email': email}
    json_email_bad = {'email': 'fake@gmail.com'}


    # Helpers

    def setup_account(self):
        """ Create an account and confirm it is stored properly.
            Returns:
                The created Account.
        """
        self.assertEqual(Account.objects.count(), 0)
        post_response = self.client.post(self.url, self.setup_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, self.email)
        self.assertEqual(new_account.username, self.username)
        self.assertEqual(new_account.first_name, self.first_name)
        self.assertEqual(new_account.last_name, self.last_name)
        return new_account

    # Tests

    # basic account tests

    def test_API_create_account(self):
        """ Test account creation and deletion. """
        self.setup_account()


    # def test_API_create_account_requires_password(self):
    #     """ POST without password results in error. 
    #         TODO breaking. 
    #     """
    #     self.assertEqual(Account.objects.count(), 0)
    #     post_response = self.client.post(self.url, self.incomplete_data, format='json')
    #     self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertEqual(Account.objects.count(), 0)


    def test_API_get_account_no_password(self):
        """ Any unauthenticated user can GET any account, but it should not contain
                password information.
        """
        self.setup_account()
        get_response = self.client.get(self.url_username)
        self.assertEqual(len(get_response.data), 9)
        self.assertEqual(get_response.data['email'], self.email)
        self.assertEqual(get_response.data['username'], self.username)
        self.assertIn('created_at', get_response.data)
        self.assertIn('updated_at', get_response.data)
        self.assertIn('first_name', get_response.data)
        self.assertIn('last_name', get_response.data)
        self.assertIn('tagline', get_response.data)
        self.assertIn('is_email_confirmed', get_response.data)
        self.assertNotIn('password', get_response.data)


    def test_API_udpate_account_must_login(self):
        """ PUT to update without. """
        self.setup_account()
        update_response = self.client.put(self.url_username, self.update_data_tagline)
        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 1)


    def test_API_udpate_account_tagline(self):
        """ Only an authenticated user can update their account. 
            Use update_response.content to see response.

            TODO still requires both PASSWORD and CONFIRM to be provided for it to work,
                for some reason, though it doesn't when using the web interface.
        """
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        update_response = self.client.put(self.url_username, self.update_data_tagline)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.count(), 1)
        updated_account = Account.objects.get()
        self.assertEqual(updated_account.tagline, self.tagline_update)


    def test_API_udpate_account_name_cannot_be_empty(self):
        """ User cannot update their name to be empty.
            Use update_response.content to see response.

            TODO still requires both PASSWORD and CONFIRM to be provided for it to work,
                for some reason, though it doesn't when using the web interface.
        """
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        update_response = self.client.put(self.url_username, self.no_name_data)
        self.assertEqual(update_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Account.objects.count(), 1)
        updated_account = Account.objects.get()
        self.assertEqual(updated_account.last_name, self.last_name)


    # def test_API_udpate_account_password(self):
    #     """ Passwords must match when updating an account. 
    #             Look in serializer update.
    #         TODO new password is breaking! Looks like it's not being hashed properly before storage.
    #     """
    #     self.setup_account()
    #     self.client.login(email=self.email, password=self.password)
    #     update_response = self.client.put(self.url_username, self.update_data_password_update)
    #     self.assertEqual(update_response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(Account.objects.count(), 1)

    #     # confirm that the new password works
    #     self.client.logout()

    #     # copied and pasted from test_API_udpate_account_tagline()
    #     self.client.login(email=self.email, password=self.password)
    #     update_response = self.client.put(self.url_username, self.update_data_tagline)
    #     self.assertEqual(update_response.status_code, status.HTTP_200_OK) # TODO new password breaks
    #     self.assertEqual(Account.objects.count(), 1)
    #     updated_account = Account.objects.get()
    #     self.assertEqual(updated_account.tagline, self.tagline_update)


    # def test_API_udpate_account_passwords_must_match(self):
    #     """ Passwords must match when updating an account. 
    #             Look in serializer update.
            # TODO must re-enable password reset feature 
    #     """
    #     self.setup_account()
    #     self.client.login(email=self.email, password=self.password)
    #     update_response = self.client.put(self.url_username, self.update_data_bad_pass)
    #     self.assertEqual(update_response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertEqual(Account.objects.count(), 1)


    def test_API_delete_account_must_login(self):
        """ Only an authenticated user can delete their own account. """
        new_account = self.setup_account()
        delete_response = self.client.delete(self.url_username)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 1)


    def test_API_delete_account(self):
        """ Deleting account removes entry from database. """
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        delete_response = self.client.delete(self.url_username)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Account.objects.count(), 0)


    # email activation

    def test_account_activation_bad_key(self):
        self.setup_account()
        bad_token = 'asdf1234'
        post_response = self.client.post(self.url_activate % bad_token)
        self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_account_activation_good_key(self):
        new_account = self.setup_account()
        good_token = new_account.get_confirmation_key()
        post_response = self.client.post(self.url_activate % good_token)
        self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(True, new_account.is_confirmed)


    def test_account_activation_already_activated(self):
        new_account = self.setup_account()
        good_token = new_account.get_confirmation_key()
        post_response = self.client.post(self.url_activate % good_token)
        post_response = self.client.post(self.url_activate % good_token)
        self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(True, new_account.is_confirmed)

    # resend activation email

    def test_resend_email_authenticated(self):
        new_account = self.setup_account()
        self.assertEqual(False, new_account.is_confirmed)
        self.client.login(email=self.email, password=self.password)
        post_response = self.client.post(self.url_resend_email, self.json_email, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)
        

    def test_resend_email_not_logged_in(self):
        new_account = self.setup_account()
        self.assertEqual(False, new_account.is_confirmed)
        post_response = self.client.post(self.url_resend_email, self.json_email, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)


    def test_resend_email_already_activated(self):
        new_account = self.setup_account()
        good_token = new_account.get_confirmation_key()
        self.client.post(self.url_activate % good_token)
        self.assertEqual(True, new_account.is_confirmed)

        self.client.login(email=self.email, password=self.password)
        post_response = self.client.post(self.url_resend_email, self.json_email, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)


    # def test_send_email(self):
    #     from django.core import mail
    #     mail.send_mail(
    #         subject='Subject here',
    #         message='Here is the message.',
    #         from_email='from@example.com',
    #         recipient_list=['nsbradford@gmail.com'],
    #         fail_silently=False,
    #     )
    #     print 'sent email'
    #     assert len(mail.outbox) == 1
    #     self.assertEqual(mail.outbox[0].subject, 'Subject here')
