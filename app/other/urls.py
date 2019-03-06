#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 8:56
__author__ = 'Peter.Fang'
from django.urls import path, include, re_path
from .views import get_platform_car_info

urlpatterns = [
    path('car_info/', get_platform_car_info),
]

