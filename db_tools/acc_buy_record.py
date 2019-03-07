#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 16:42
__author__ = 'Peter.Fang'
import os
import sys
import xlrd

from util import common_util

pwd = os.path.dirname(os.path.realpath(__file__))
sys.path.append(pwd + "../")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "df2.settings")

import django

django.setup()

from app.acc.models import AccBuyRecordManage

limit = 52


# 打开文件，读取数据
def read_excel():
    n = 1
    i = 0
    acc_list = []
    try:
        # 打开excel
        excel = xlrd.open_workbook('data/acc_record.xls')
        # 打开表
        table = excel.sheet_by_index(0)
        # 读取每一行
        while n < table.nrows:
            # 读取一行
            sn, name, count, _, cost, total_cost, *_ = table.row_values(n)
            n += 1
            i += 1
            acc_list.append(
                AccBuyRecordManage(station_id=1, sn=sn, name=name, count=int(count),
                                   cost=float(str(total_cost).replace(',', '')),
                                   total_cost=float(str(total_cost).replace(',', ''))))
            if i >= limit:
                i = 0  # 计数重置
                acc_list = []  # 存入列表重置
                AccBuyRecordManage.objects.bulk_create(acc_list)  # 批量存入数据库
            elif n == table.nrows - 1:
                AccBuyRecordManage.objects.bulk_create(acc_list)  # 批量存入数据库

    except Exception as e:
        print(e)


if __name__ == '__main__':
    read_excel()
