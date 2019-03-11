#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/27 10:48
__author__ = 'Peter.Fang'

from rest_framework import serializers
from .models import CarInfoManage, CarFixManage, CarFixAccManage
from app.staff.models import EmployeeManage
from app.staff.serializer import EmployeeSerializer
from util import common_util


class CarInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarInfoManage
        fields = "__all__"

    # 重写了新增方法，因为这里要改成新增或修改
    def create(self, validated_data):
        # validated_data是提交的数据，**但是只有模型范围内的字段**
        # 通过self.context['request'].data['xxx']可以获取提交过来的其他数据
        sn = validated_data.pop('sn', None)
        # update_or_create 修改或新增 **kwargs是关键词， defaults是要存入的内容
        car_info, created = CarInfoManage.objects.update_or_create(
            sn=sn, defaults=validated_data)
        # 直接操作model对象，并返回
        return car_info


class FixAccSerializer(serializers.ModelSerializer):
    fix_man_name = serializers.SerializerMethodField(read_only=True)  # 增加展示的外来字段

    class Meta:
        model = CarFixAccManage
        # all可以展示origin和新增的所有字段
        fields = "__all__"

    @staticmethod
    def get_fix_man_name(obj):
        try:
            return obj.fix_man.name
        except Exception as e:
            raise e


class CarFixSerializer(serializers.ModelSerializer):
    car = CarInfoSerializer(read_only=True)
    fix_man = EmployeeSerializer(read_only=True)

    class Meta:
        model = CarFixManage
        fields = "__all__"

    @staticmethod
    def _get_fix_man(name):
        try:
            return EmployeeManage.objects.get(name=name).id
        except Exception as e:
            raise e

    def create(self, validated_data):
        # 由于read_only将car_id自动过滤，只能通过获取参数值，来创建car_fix
        car_info = CarFixManage(**validated_data, car_id=self.context['request'].data['car_id'],
                                fix_man_id=self._get_fix_man(self.context['request'].data['fix_man_id']))
        car_info.save()
        return car_info

    def update(self, instance, validated_data):
        common_util.debug(validated_data)
        instance.car_id = self.context['request'].data['car_id']
        instance.fix_man_id = self._get_fix_man(self.context['request'].data['fix_man_id'])
        instance.odo = validated_data.get('odo', instance.odo)
        instance.date = validated_data.get('date', instance.date)
        instance.odo = validated_data.get('odo', instance.odo)
        instance.income = validated_data.get('income', instance.income)
        instance.remark = validated_data.get('remark', instance.remark)
        instance.logging = validated_data.get('logging', instance.logging)
        instance.maintain = validated_data.get('maintain', instance.maintain)
        instance.save()
        return instance
