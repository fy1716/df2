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
    print(data)
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


def _get_fix_amount(order_no):
    data = [
        ('orderNo', order_no),
        ('roId', 1005682656),
        ('lookType', 'jd'),
        ('_JSON_PARAMS_', ''),
    ]
    r = s.post(
        "http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CostClean/repairOrderDetail.do?lastLoginUserName=F13-0009_HGH",
        data)
    print(r.text)


# 获取单台车的三包信息
def _get_single_info(order_no):
    _get_fix_amount(order_no)  # 获取三包金额


def get_gurantee(day_start=today, day_end=today):
    login()
    data = [
        ('COMMAND', 1),
        ('_search', False),
        ('nd', 1551878159019),
        ('rows', 50),
        ('page', 1),
        ('sidx', ''),
        ('sord', 'desc'),
    ]
    r = s.post(
        "http://dcms.dfsk.com.cn/DCMS/servicemng/businessreception/CustomerReception/queryCustomerReception.json", data)
    print(r.text)
    seq = 'ORDER_NO:"'
    if seq in r.text:
        temp_list = r.text.split(seq)[1:]
        order_list = [item.split('"')[0] for item in temp_list]
        print(order_list)

    for item in order_list:
        time.sleep(0.5)
        _get_single_info(item)


def download_gurantee():
    # login()
    print(123)
    res_add = s.get(
        "http://idcs.dfsk.com.cn/common/UserManager/login.do?userName=f1011109&password=1234qwer&rFlag=113-0000fa1c170b0a79d73&funcId=1e4ad363503a24b210130103&logonUsers=F13-0009_HGH")
    print(res_add.text)
    # res_add = s.get(
    #     "http://idcs.dfsk.com.cn/sysusermng/sysuserinfo/DcsFuncMapping/pageIntegration1.do?funcId=1e4ad363503a24b210130103&password=1234qwer&vin=null&inMileage=null&codes=null&codes_type=null&labcodes=null&labcodes_type=null")
    # print(res_add.text)
    time.sleep(0.5)
    import requests

    # data = {
    #     "RO_STARTDATE": "2019-03-01",
    #     "RO_ENDDATE": "2019-03-31",
    # }
    # response = requests.post('http://idcs.dfsk.com.cn/claim/dealerClaimMng/ClaimBillTrack/export.do', data=data)
    data = [
        ('RO_STARTDATE', '2019-03-01'),
        ('RO_ENDDATE', '2019-03-31'),
    ]
    r = s.post(
        "http://idcs.dfsk.com.cn/claim/dealerClaimMng/ClaimBillTrack/export.do", data)
    print(r.text)
    print('*' * 30)
    # with open('gurantee.xls', 'wb') as f:
    #     f.write(response.content)
    #     f.close()

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
    # print(get_info("JA042894"))
    get_gurantee()
    download_gurantee()
