# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_auto_20170901_2154'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='majors',
        ),
        migrations.AddField(
            model_name='project',
            name='major',
            field=models.CharField(default=b'N/A', max_length=40),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(max_length=40),
            preserve_default=True,
        ),
    ]
