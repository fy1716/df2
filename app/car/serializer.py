#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/27 10:48
__author__ = 'Peter.Fang'


from django.forms.models import model_to_dict
from rest_framework import serializers
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject
from rest_framework.validators import UniqueTogetherValidator

from .models import CarInfoManage, CarFixManage, CarFixAccManage
from app.acc.models import AccManage
from app.staff.models import EmployeeManage
from app.staff.serializer import EmployeeSerializer
from util import common_util


class CarInfoSerializer(common_util.BaseSerializer):
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


class FixAccSerializer(common_util.BaseSerializer):
    fix_man_name = serializers.SerializerMethodField(read_only=True)  # 增加展示的外来字段

    class Meta:
        model = CarFixAccManage
        # all可以展示origin和新增的所有字段
        fields = "__all__"

        validators = [
            UniqueTogetherValidator(
                queryset=CarFixAccManage.objects.all(),
                fields=('sn', 'fix'),
                message='该配件已添加，请检查!!!'
            )]

    @staticmethod
    def get_fix_man_name(obj):
        try:
            return obj.fix_man.name
        except Exception as e:
            raise e

    def create(self, validated_data):
        acc = {
            "sn": validated_data['sn'],
            "name": '',
            "type": '',
            "price": 0,
            "cost": 0,
        }
        try:
            data = AccManage.objects.get(sn=validated_data['sn'])
            acc = {k: getattr(data, k) for k in acc}
            fix_acc = CarFixAccManage(**acc, fix_id=validated_data['fix'].id,
                                      fix_man_id=validated_data['fix'].fix_man.id)
            fix_acc.save()
            return fix_acc
        except Exception as e:
            raise e


class CarFixSerializer(common_util.BaseSerializer):
    car_detail = serializers.SerializerMethodField(read_only=True)
    fix_man_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CarFixManage
        fields = "__all__"

    @staticmethod
    def get_car_detail(obj):
        try:
            return model_to_dict(CarInfoManage.objects.get(id=obj.car.id))
        except Exception as e:
            common_util.debug(e)
            return {}

    @staticmethod
    def get_fix_man_detail(obj):
        try:
            return model_to_dict(EmployeeManage.objects.get(id=obj.fix_man.id))
        except Exception as e:
            common_util.debug(e)
            return {}

    @staticmethod
    def _get_fix_man(name):
        try:
            return EmployeeManage.objects.get(name=name).id
        except Exception as e:
            raise e

