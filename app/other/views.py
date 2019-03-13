import datetime
from django.shortcuts import render_to_response
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from util import common_util
from app.car.models import CarFixManage
from util import platform_util


# 从公司平台服务器获取车辆信息
def get_platform_car_info(request):
    from util import platform_util
    VIN = request.GET.get("VIN", "")
    common_util.debug(VIN)
    if VIN:
        data = platform_util.get_info(VIN)
        if data is None:
            return common_util.json_response(False, message="该底盘号未获取到车辆信息")
        common_util.debug(data)
        return common_util.json_response(True, data=data, message="更新车辆信息成功")
    else:
        return common_util.json_response(False, message="未获取到车辆底盘号")


@csrf_exempt
def sync_guarantee(request):
    if request.method == 'POST':
        platform_util.do_sync_gurantee()
        return common_util.json_response(True, message="同步成功")


def print_report(request):
    fixTotal = 0
    car_list = []
    day_start = request.GET.get('day_start')
    day_end = request.GET.get('day_end')
    now = datetime.datetime.now()
    today = now.strftime("%Y-%m-%d")
    ret = list(CarFixManage.objects.filter(date__gte=day_start, date__lte=day_end))
    for item in ret:
        acc_data = [acc.name for acc in item.fix_acc.all()]
        print(acc_data)
        item.carAccName = ' || '.join(acc_data)  # 添加配件信息
        item.carAccPrice = sum(acc.price * acc.usage for acc in item.fix_acc.all() if not acc.guarantee)
        fixTotal += item.income
    return render_to_response("media/views/printReport.html",
                              {"reportItems": ret, "today": today, "fixTotal": fixTotal})


def fix_sum(request, fix_id):
    sum = 0
    maintainFlag = False  # 默认没进行保养
    oilList = ['1600000-01', '8600000-05']  # 机油列表
    comRemark = ""
    fix_acc_list = []
    userName = '益阳德丰'
    stationName = '益阳德丰'
    hotline = '0737-4225875'
    date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    # 获取本次维修信息
    data_fix = CarFixManage.objects.get(id=fix_id)

    for acc_item in data_fix.fix_acc.all():
        acc_item = model_to_dict(acc_item)
        if not acc_item['guarantee']:
            sum += acc_item['price'] * acc_item['usage']
        else:
            acc_item['name'] = acc_item['name'] + '(三包)'
        if acc_item['sn'] in oilList:
            maintainFlag = True
        fix_acc_list.append(acc_item)
    if data_fix.remark is None:
        data_fix.remark = ''
    if maintainFlag:
        pre_dis = data_fix.odo + 5000
        data_fix.remark += " 下次保养%sKM" % (pre_dis)

    comRemark += data_fix.remark
    car_fix_info = model_to_dict(data_fix)
    car_info = model_to_dict(data_fix.car)
    # fix_acc_list = [model_to_dict(item) for item in data_fix.fix_acc.all()]
    return render_to_response("media/views/sum.html",
                              {"carFixInfo": car_fix_info, 'userName': userName, 'stationName': stationName,
                               'hotline': hotline,
                               "carInfo": car_info, "carFixAcc": fix_acc_list, "date": date,
                               "note": comRemark, "sum": sum})
