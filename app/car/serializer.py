#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/27 10:48
__author__ = 'Peter.Fang'

from rest_framework import serializers
from .models import CarInfoManage, CarFixManage


class CarInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarInfoManage
        fields = "__all__"


class CarFixSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarFixManage
        fields = "__all__"
