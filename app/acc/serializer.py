#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/27 10:48
__author__ = 'Peter.Fang'

from rest_framework import serializers
from .models import AccManage


class AccSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccManage
        fields = ('name', 'price')

    def create(self, validated_data):
        AccManage.objects.create(**validated_data)
