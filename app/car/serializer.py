#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/27 10:48
__author__ = 'Peter.Fang'

from rest_framework import serializers
from .models import CarInfoManage, CarFixManage, CarFixAccManage
from app.staff.serializer import EmployeeSerializer


class CarInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarInfoManage
        fields = "__all__"

    def create(self, validated_data):
        sn = validated_data.pop('sn', None)
        car_info, created = CarInfoManage.objects.update_or_create(
            sn=sn, defaults=validated_data)
        return car_info


class FixAccSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarFixAccManage
        fields = "__all__"


class CarFixSerializer(serializers.ModelSerializer):
    car = CarInfoSerializer(read_only=True)
    fix_acc = FixAccSerializer(many=True, read_only=True)  # 被外键的字段，添加在这就可以直接显示
    fix_man = EmployeeSerializer(read_only=True)

    class Meta:
        model = CarFixManage
        fields = "__all__"
