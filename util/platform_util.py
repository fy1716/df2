#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 8:44
__author__ = 'Peter.Fang'

import requests, time, json
from datetime import datetime

s = requests.session()
data = [
    ('serverName', 'dcms.dfsk.com.cn'),
    ('visistBrowser', 'CHROME'),
    ('visistVersion', '68.0.3440.106'),
    ('userName', 'F13-0009_HGH'),
    ('pwd', '1234qwer'),
]
data_Location = [
    ('deptId', ''),
    ('poseId', ''),
]

data_VIN = [
    ('VIN', ''),
    ('lastLoginUserName', 'F13-0009_HGH'),
]

data_VIN_DETAIL = [
    ('VIN', 'LVZA53P90FC641821'),
    ('_JSON_PARAMS_', ''),
]
today = datetime.now().strftime('%Y-%m-%d')


def parse_info_html(res):
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(res.text, 'html.parser')
    format = ["number", "car_type", "buy_date", "pro_date", "owner", "tel"]
    number = soup.find(name='input', attrs={"id": "LICENSE_NOID"}).get('value')
    car_type = soup.find(name='td', text={"物料："}).findNext('td').contents[0]
    buy_date = soup.find(name='td', text={"购车日期："}).findNext('td').contents[0].strip()
    pro_date = soup.find(name='td', text={"生产日期："}).findNext('td').contents[0].strip()
    owner = soup.find(name='td', text={"车主姓名："}).findNext('td').contents[0].strip()
    tel = soup.find(name='td', text={"车主电话："}).findNext('td').contents[0].strip()
    data = (number, car_type, buy_date, pro_date, owner, tel)
    return {k: v for k, v in zip(format, data)}


def login(acc_flag=False):
    res = s.post("http://dcms.dfsk.com.cn/DCMS/common/login/LoginManager/doLogin.json", data)
    if not acc_flag:
        ret = s.post("http://dcms.dfsk.com.cn/DCMS/common/menu/MenuShow/menuDisplay.do?poseId=1100013086",
                     data_Location)


def get_info(VIN):
    login()
    data_VIN = [
        ('VIN', VIN),
        ('lastLoginUserName', 'F13-0009_HGH'),
    ]
    r = s.post("http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/vinSelect.json", data_VIN)
    if 'vin:' in r.text:
        temp1 = r.text.split('vin:')
        temp2 = temp1[1].split('"')
        data_VIN_DETAIL = [
            ('VIN', temp2[1]),
            ('_JSON_PARAMS_', ''),
        ]

        r = s.post(
            "http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/repairOrderAddInit.do?lastLoginUserName=F13-0009_HGH",
            data_VIN_DETAIL)
        if VIN in r.text:
            return parse_info_html(r)


def get_gurantee(day_start=today, day_end=today):
    login()
    data = [
        ('VIN', 1),
        ('lastLoginUserName', 'F13-0009_HGH'),
    ]
    r = s.post("http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/vinSelect.json", data)
    print(r.text)


if __name__ == "__main__":
    # 登录
    # res=s.post("http://dcms.dfsk.com.cn/DCMS/common/login/LoginManager/doLogin.json",data)
    # # c = print(res.text)
    # # 进入职位选择
    # # res=s.get("http://dcms.dfsk.com.cn/DCMS/common/login/LoginManager/login.do?userId=1100013384")
    # # print(res.text)
    # # 选择职位
    # ret = s.post("http://dcms.dfsk.com.cn/DCMS/common/menu/MenuShow/menuDisplay.do?poseId=1100013086", data_Location)
    # # print(ret.text)
    # # 获取完整VIN
    # # res_add = s.get("http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/queryCustomerReceptionInit.do?lastLoginUserName=F13-0009_HGH")
    # # print(res_add.text)
    # # 获取完整VIN
    # r = s.post("http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/vinSelect.json?&VIN=FC641821&lastLoginUserName=F13-0009_HGH", data_VIN)
    # # print(r.text)
    # # 获取完整VIN
    # r = s.post("http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/repairOrderAddInit.do?lastLoginUserName=F13-0009_HGH", data_VIN_DETAIL)
    # # print(r.text)
    # print('湘H0FY90' in r.text)
    # parse_html(r)
    print(get_info("JA042894"))
