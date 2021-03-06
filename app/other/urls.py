#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 8:56
__author__ = 'Peter.Fang'
from django.urls import path, include, re_path
from . import views

urlpatterns = [
    path(r'car_info/', views.get_platform_car_info),
    path(r'sum/<int:fix_id>/', views.fix_sum),  # 结算
    path(r'daily_report/', views.print_report),  # 总结
    path(r'sync_guarantee/', views.sync_guarantee),  # 总结
]

