#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/26 9:40
__author__ = 'Peter.Fang'

import xadmin
from .models import AccManage


class AccAdmin(object):
    list_display = ['name']
    search_fields = ['name', ]
    list_filter = ['name', ]


xadmin.site.register(AccManage, AccAdmin)
