from django.db import models
from app.staff.models import EmployeeManage


# 车辆信息
class CarInfoManage(models.Model):
    station_id = models.SmallIntegerField(null=True)
    sn = models.CharField(max_length=50, unique=True)
    number = models.CharField(max_length=50, null=True, unique=True)
    type = models.CharField(max_length=10, null=True)
    but_date = models.DateField(null=True)
    pro_date = models.DateField(null=True)
    owner = models.CharField(max_length=50, null=True)
    tel = models.CharField(max_length=15, null=True)
    remark = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'carInfo'


def _get_employee():
    return EmployeeManage.objects.get_or_create(username='deleted')[0]


# 维修信息
class CarFixManage(models.Model):
    station_id = models.SmallIntegerField()
    car = models.ForeignKey('CarInfoManage', on_delete=models.CASCADE, related_name='car_fix')
    odo = models.SmallIntegerField(null=True)
    date = models.DateField('维修日期')
    reg_time = models.CharField(max_length=24, null=True)
    income = models.SmallIntegerField(default=0, null=True)
    fix_man = models.ForeignKey('staff.EmployeeManage', null=True, on_delete=models.SET(_get_employee))
    remark = models.CharField(max_length=1024, null=True)
    logging = models.BooleanField(default=False)
    maintain = models.BooleanField(default=False)
    temp_id = models.SmallIntegerField(default=0, null=True)

    class Meta:
        db_table = 'car_fix'


# 维修配件
class CarFixAccManage(models.Model):
    date = models.DateField(verbose_name='更换日期')
    station_id = models.IntegerField()
    fix = models.ForeignKey('CarFixManage', on_delete=models.CASCADE, related_name='fix_acc')
    # 记录下配件信息，而不是外键，这样保证存留历史快照
    name = models.CharField(max_length=50)
    id_number = models.CharField(max_length=50)
    type = models.CharField(max_length=30, blank=True)
    price = models.SmallIntegerField()
    usage = models.SmallIntegerField()
    cost = models.FloatField(default=0)
    guarantee = models.BooleanField(default=False)
    pid = models.CharField(max_length=128)
