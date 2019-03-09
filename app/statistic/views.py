from django.db.models import Sum
from util import common_util
from app.car.models import CarFixManage


# Create your views here.

# 当天的收支信息
def get_amount(request):
    cost = 0
    ret = {}
    gurantee = 0
    today = common_util.get_today()
    day_start = request.GET.get("day_start", today)
    day_end = request.GET.get("day_end", today)
    car_list = CarFixManage.objects.filter(date__range=(day_start, day_end))
    ret['amount'] = sum(car.income for car in car_list)
    for car in car_list:
        acc_list = car.fix_acc.all()
        # 非三包配件材料费
        cost += round(sum(acc.cost * acc.usage for acc in acc_list if not acc.guarantee), 2)
        gurantee += round(sum(acc.cost * acc.usage for acc in acc_list if acc.guarantee), 2)
    ret['cost'] = cost
    ret['gurantee'] = gurantee
    return common_util.json_response(True, data=ret)
