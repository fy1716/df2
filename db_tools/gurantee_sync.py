#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 16:42
__author__ = 'Peter.Fang'
import os
import sys

import traceback
import datetime
import subprocess
import xlrd
import xlwt
from django.forms.models import model_to_dict

pwd = os.path.dirname(os.path.realpath(__file__))
main_dir = os.path.dirname(pwd)
sys.path.append(main_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "df2.settings")

import django

django.setup()

from app.car.models import Gurantee, CarFixAccManage
from app.staff.models import SubSite
from util import common_util

limit = 100


def get_today(str_flag=True):
    today = datetime.date.today()
    if str_flag:
        return today.strftime('%Y-%m-%d')
    return today


# 打开文件，读取数据
def read_excel():
    n = 1
    i = 0
    gurantee_list = []
    param_dict = {}
    try:
        print("开始时间", day_start)
        print("结束时间", day_end)
        data = Gurantee.objects.filter(apply_date__range=(day_start, day_end))
        order_no_list = [item.order_no for item in data]
        not_check_list = [(item.order_no, item.acc_sn) for item in data if item.check_date is None]  # 未审核
        print("未审核", not_check_list)
        # 获取一条最新的有效数据
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
            if (param_dict['order_no'], param_dict['acc_sn']) in not_check_list:
                # 如果未审核，不必更新
                if not param_dict['check_date']:
                    continue
                # 更新
                order_no = param_dict.pop('order_no')
                acc_sn = param_dict.pop('acc_sn')
                print("更新", order_no)
                Gurantee.objects.filter(order_no=order_no, acc_sn=acc_sn).update(**param_dict)
                continue
            if param_dict['order_no'] in order_no_list:  # 过滤已存在的
                continue
            # 未审核日期格式处理
            if param_dict['check_date'] == '':
                param_dict['check_date'] = None
            param_dict["sub_site_id"] = 3  # 注意 3 代表德丰，新增默认为本站
            gurantee_list.append(Gurantee(**param_dict))
            param_dict = {}
            if i >= limit:
                i = 0  # 计数重置
                gurantee_list = []  # 存入列表重置
                Gurantee.objects.bulk_create(gurantee_list)  # 批量存入数据库
        if gurantee_list:
            print("新增", gurantee_list)
            Gurantee.objects.bulk_create(gurantee_list)  # 批量存入数据库
        # 更新到对应的车辆
        subprocess.run(
            ['/home/fangyu/Venv/df2/bin/python', os.path.join(common_util.BASE_DIR, 'db_tools/gurantee2fixacc.py')])

    except Exception as e:
        traceback.print_exc()  # 打印错误信息
        print(e)


def _guarantee_to_xls():
    common_util.debug(day_start)
    common_util.debug(day_end)
    data = Gurantee.objects.filter(apply_date__range=(day_start, day_end)).order_by('apply_date')
    if not data:
        return
    style_del = xlwt.XFStyle()
    style_del.alignment.wrap = 1

    header = ['申请日期', '审核状态', 'VIN', '车型', '配件名称', '配件费', '工时费', '总金额', '维修站',
              '同步', '自增', '备注', '审核日期', '配件代码', '配件数', '工时数', '维修类型', '索赔类型', '活动费',
              '辅料费', '特殊费']
    param_list = ["apply_date", "check_state", "car_sn", "car_type",
                  "acc_name", "acc_fee", "guarantee_time_fee", "total_fee", "sub_site",
                  "is_sync", "is_fake", "remark", "acc_sn", "acc_count",
                  "guarantee_time", "repair_type", "gurantee_type", "event_fee", "material_fee", "special_fee",
                  "total_fee"]

    xls = xlwt.Workbook(style_compression=2)
    sheet = xls.add_sheet("Sheet1")
    sheet.col(2).width = (20 * 367)  # 设置表格的宽度
    sheet.col(4).width = (20 * 367)
    # sheet.col(9).width = (10 * 367)
    # sheet.col(10).width = (10 * 367)
    i = 0
    row = 1
    # 写表头
    for each_header in header:
        sheet.write(0, i, each_header)
        i += 1
    for model in data:
        i = 0
        item = model_to_dict(model)
        item['apply_date'] = item['apply_date'].strftime('%m-%d')
        item['is_sync'] = "是" if item['is_sync'] else "否"
        item['is_fake'] = "是" if item['is_fake'] else "否"
        common_util.debug(item)
        common_util.debug(item['sub_site'])
        try:
            item['sub_site'] = SubSite.objects.get(id=item['sub_site']).name
        except Exception as e:
            pass
        for key in param_list:
            sheet.write(row, i, item[key])
            i += 1
        row += 1

    xls.save(os.path.join(main_dir, 'templates/media/data/三包.xls'))


if __name__ == '__main__':
    try:
        _, day_start, day_end = sys.argv
    except Exception as e:
        day_start = common_util.get_today()
        day_end = common_util.get_today(1)
    read_excel()
    try:
        _guarantee_to_xls()
    except Exception as e:
        common_util.debug(e)
