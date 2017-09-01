"""
    projects/models.py
    Nicholas S. Bradford
    08-17-17

"""

from django.db import models

from authentication.models import Account


class Project(models.Model):
    """ 
    TODO: ForeignKey for Many to One, and ManyToManyField 
        projectAuthor: The creator of the project. Many to one
        projectName: The title of the Project
        projectTagLine: A short, one sentence description of the project
        projectDescription: a detailed summary of the project
        projectMajor: the majors that are needed by the project
        projectSkills: the skills that are needed 
        postDate: the day that the project was created
        projectBeginDate: the date the project will be started
        projectEndDate: the date the project will end.
        projectDuration: how long the duration of the project is.
    """
    author = models.ForeignKey(Account)
    title = models.CharField(max_length=40, default='MyTitle')
    description = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return 'Title: {0}; Description: '.format(self.title, self.description)

