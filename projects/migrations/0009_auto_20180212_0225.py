# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-02-12 02:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0008_auto_20180108_2220'),
    ]

    operations = [
        migrations.AlterField(
            model_name='major',
            name='title',
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name='project',
            name='majors',
            field=models.ManyToManyField(blank=True, to='projects.Major'),
        ),
    ]
