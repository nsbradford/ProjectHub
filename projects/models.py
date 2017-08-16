from django.db import models

# Create your models here.

from authentication.models import Account


class Project(models.Model):
	author = models.ForeignKey(Account)
	content = models.TextField()
	
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __unicode__(self):
		return '{0}'.format(self.content)

