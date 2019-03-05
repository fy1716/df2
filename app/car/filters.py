#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/2/28 15:21
__author__ = 'Peter.Fang'
import django_filters
from .models import CarInfoManage, CarFixManage, CarFixAccManage


class CarInfoFilter(django_filters.rest_framework.FilterSet):
    """
    按购车日期过滤
    """
    station_id = django_filters.NumberFilter(field_name="station_id")
    day_start = django_filters.DateFilter(field_name="buy_date", lookup_expr="gte")
    day_end = django_filters.DateFilter(field_name="buy_date", lookup_expr="lte")

    class Meta:
        model = CarInfoManage
        fields = ['station_id', 'day_start', 'day_end']


class CarFixFilter(django_filters.rest_framework.FilterSet):
    """
    按维修日期过滤
    """
    station_id = django_filters.NumberFilter(field_name="station_id")
    day_start = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    day_end = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = CarFixManage
        fields = ['station_id', 'day_start', 'day_end']


class FixAccFilter(django_filters.rest_framework.FilterSet):
    """
    按维修ID过滤
    """
    # fix_id = django_filters.NumberFilter(name="fix__id", method='fix_id_filter')

    # def fix_id_filter(self, queryset, name, value):
    #     return queryset.filter(fix__id=value)

    class Meta:
        model = CarFixAccManage
        fields = ['fix_id']
