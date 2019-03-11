#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/1 14:13
__author__ = 'Peter.Fang'

from rest_framework import serializers
from .models import EmployeeManage
from app.car.models import EmployeeBonusManage


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeManage
        fields = "__all__"


class EmployeeBonusSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()

    class Meta:
        model = EmployeeBonusManage
        fields = "__all__"
