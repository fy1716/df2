#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/21 17:00
__author__ = 'Peter.Fang'

from django.db.models.signals import post_migrate

from .models import EmployeeManage as model
from .apps import StaffConfig as config

# get app name
name = config.name.split('.')[-1]


def init_db(sender, **kwargs):
    if sender.name == config.name:
        if not model.objects.exists():
            model.objects.create(name='方建平', em_type=1)
            model.objects.create(name='焦俊峰', em_type=1)
            model.objects.create(name='唐世文', em_type=1)
            model.objects.create(name='张振宇', em_type=1)


post_migrate.connect(init_db)
