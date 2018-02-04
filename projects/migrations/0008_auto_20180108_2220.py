# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-08 22:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_auto_20171209_2322'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='major',
        ),
        migrations.AddField(
            model_name='project',
            name='majors',
            field=models.ManyToManyField(to='projects.Major'),
        ),
    ]
