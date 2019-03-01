#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/28 15:21
__author__ = 'Peter.Fang'
import django_filters
from .models import CarInfoManage


class CarInfoFilter(django_filters.rest_framework.FilterSet):
    """
    按购车日期过滤
    """
    station_id = django_filters.NumberFilter(field_name="station_id")
    start_date = django_filters.DateFilter(field_name="but_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="but_date", lookup_expr="lte")

    class Meta:
        model = CarInfoManage
        fields = ['station_id', 'start_date', 'end_date']


class CarFixFilter(django_filters.rest_framework.FilterSet):
    """
    按维修日期过滤
    """
    station_id = django_filters.NumberFilter(field_name="station_id")
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = CarInfoManage
        fields = ['station_id', 'start_date', 'end_date']
