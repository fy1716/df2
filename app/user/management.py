#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/21 17:00
__author__ = 'Peter.Fang'

from django.db.models.signals import post_migrate

from .models import UserManage as model
from .apps import UserConfig as config

# get app name
name = config.name.split('.')[-1]


def init_db(sender, **kwargs):
    if sender.name == config.name:
        if not model.objects.exists():
            model.objects.create_superuser(username='root', password='eisoo.com', email='909364345@qq.com', role=0)
            model.objects.create_superuser(username='fy1716', password='eisoo.com', email='909364345@qq.com', role=1)


post_migrate.connect(init_db)
