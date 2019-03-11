#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/1 14:28
__author__ = 'Peter.Fang'

import django_filters
from app.car.models import EmployeeBonusManage


class EmployeeBonusFilter(django_filters.rest_framework.FilterSet):
    """
    按日期过滤
    """
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = EmployeeBonusManage
        fields = ['start_date', 'end_date']
