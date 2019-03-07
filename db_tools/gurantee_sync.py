#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 16:42
__author__ = 'Peter.Fang'
import os
import sys
import traceback
import xlrd

from util import common_util

pwd = os.path.dirname(os.path.realpath(__file__))
sys.path.append(pwd + "../")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "df2.settings")

import django

django.setup()

from app.car.models import Gurantee

limit = 100


# 打开文件，读取数据
def read_excel():
    n = 1
    i = 0
    gurantee_list = []
    param_dict = {}
    try:
        param_list = ["order_no", "apply_date", "check_date", "repair_type", "gurantee_type",
                      "check_state", "car_sn", "car_type", "acc_sn", "acc_name",
                      "acc_unit", "acc_count", "acc_fee", "guarantee_unit", "guarantee_time",
                      "guarantee_time_fee", "event_fee", "material_fee", "special_fee", "total_fee"]
        # 打开excel
        path = os.path.dirname(__file__)
        excel = xlrd.open_workbook(os.path.join(path, 'data/download_gurantee.xls'))
        # 打开表
        table = excel.sheet_by_index(0)
        # 读取每一行
        while n < table.nrows:
            # 读取一行
            order_no, gurantee_type, _, car_type, _, _, car_sn, _, _, apply_date, check_state, check_date, \
            _, _, repair_type, acc_sn, acc_name, guarantee_time, guarantee_unit, guarantee_time_fee, acc_count, \
            acc_unit, acc_fee, _, _, event_fee, material_fee, special_fee, _, total_fee, *_ = table.row_values(n)[3:]
            n += 1
            i += 1
            for item in param_list:
                param_dict[item] = locals()[item]
            gurantee_list.append(Gurantee(**param_dict))
            param_dict = {}
            if i >= limit:
                i = 0  # 计数重置
                gurantee_list = []  # 存入列表重置
                Gurantee.objects.bulk_create(gurantee_list)  # 批量存入数据库
            elif n == table.nrows - 1:
                Gurantee.objects.bulk_create(gurantee_list)  # 批量存入数据库

    except Exception as e:
        traceback.print_exc()  # 打印错误信息
        print(e)


if __name__ == '__main__':
    read_excel()
