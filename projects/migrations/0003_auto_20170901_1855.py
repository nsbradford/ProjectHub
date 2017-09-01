# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_auto_20170812_1920'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='content',
            new_name='description',
        ),
        migrations.AddField(
            model_name='project',
            name='title',
            field=models.CharField(default=b'MyTitle', max_length=40),
            preserve_default=True,
        ),
    ]
