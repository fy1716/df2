#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 10:33
__author__ = 'Peter.Fang'
import os
import sys
import xlrd

pwd = os.path.dirname(os.path.realpath(__file__))
main_dir = os.path.dirname(pwd)
sys.path.append(main_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "df2.settings")

import django

django.setup()

from app.acc.models import AccManage

# sn 列号
col_sn = 0
# cost col index
col_cost = 6


def _get_price(sn):
    try:
        # 打开excel
        excel = xlrd.open_workbook('data/acc.xls')
        # 打开表
        table = excel.sheet_by_index(0)
        # 读取sn列表存入sn_list
        sn_list = table.col_values(col_sn, start_rowx=1)
        # 查询目标所在行
        try:
            # due to sn_list start from 1, so we should add 1 when get cell value
            sn_row = sn_list.index(sn) + 1
            # 获取对应price值， 四舍五入截断
            cost = round(table.cell_value(sn_row, col_cost), 1)
        except ValueError as e:
            cost = -1
        return cost
    except Exception as e:
        print(e)
        return -1


# get group data from db
group = 100


def _get_db_acc(start, end):
    acc_list = AccManage.objects.all()[start:end]
    for acc in acc_list:
        cost = _get_price(acc.sn)
        if cost != -1:
            # update cost
            acc.cost = cost
            acc.save()
            print(acc.sn, 'update cost', cost)
        else:
            print(acc.sn, 'does not exist in excel')


def get_acc():
    n = 0
    # get acc count
    count = AccManage.objects.all().count()
    while n < count // group + 1:
        start = n * group
        end = (n + 1) * group
        _get_db_acc(start, end)
        n += 1


if __name__ == '__main__':
    # _get_db_acc(0, 1)
    get_acc()
