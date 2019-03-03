#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/21 17:00
__author__ = 'Peter.Fang'

from django.db.models.signals import post_migrate

from .models import CarInfoManage as model
from .apps import CarConfig as config

# get app name
name = config.name.split('.')[-1]


# def init_db(sender, **kwargs):
#     if sender.name == config.name:
#         if not model.objects.exists():
#             model.objects.create(number='xh101', sn='FA01')
#
#
# post_migrate.connect(init_db)
