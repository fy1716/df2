#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/21 17:00
__author__ = 'Peter.Fang'

from django.db.models.signals import post_migrate

from .models import AccManage
from .apps import AccConfig

# get app name
name = AccConfig.name.split('.')[-1]


def init_db(sender, **kwargs):
    print(sender.name)
    if sender.name == AccConfig.name:
        if not AccManage.objects.exists():
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)
            AccManage.objects.create(name='机油格', sn='CA100801-FA01', price=25)


post_migrate.connect(init_db)
