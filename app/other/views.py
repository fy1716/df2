from util import common_util


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
