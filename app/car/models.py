from django.db import models
from app.staff.models import EmployeeManage


# 车辆信息
class CarInfoManage(models.Model):
    station_id = models.SmallIntegerField(null=True)
    sn = models.CharField(max_length=50)
    number = models.CharField(max_length=50, null=True, blank=True)
    type = models.CharField(max_length=90, null=True, blank=True)
    buy_date = models.DateField(null=True, blank=True)
    pro_date = models.DateField(null=True, blank=True)
    owner = models.CharField(max_length=50, null=True, blank=True)
    tel = models.CharField(max_length=30, null=True, blank=True)
    remark = models.CharField(max_length=100, null=True, blank=True)
    old_id = models.IntegerField(verbose_name="ord_id", null=True, blank=True)

    class Meta:
        db_table = 'car_info'

    def __str__(self):
        return self.number


def _get_employee():
    return EmployeeManage.objects.get_or_create(username='deleted')[0]


# 维修信息
class CarFixManage(models.Model):
    station_id = models.SmallIntegerField(null=True)
    car = models.ForeignKey('CarInfoManage', on_delete=models.CASCADE, related_name='car_fix')
    odo = models.IntegerField(null=True)
    date = models.DateField('维修日期')
    reg_time = models.CharField(max_length=24, null=True)
    income = models.SmallIntegerField(default=0, null=True)
    fix_man = models.ForeignKey('staff.EmployeeManage', null=True, on_delete=models.CASCADE)
    remark = models.CharField(max_length=1024, null=True, default='')
    logging = models.BooleanField(default=False)
    maintain = models.BooleanField(default=False)
    temp_id = models.SmallIntegerField(default=0, null=True)
    old_id = models.IntegerField(verbose_name="ord_id", null=True)

    class Meta:
        db_table = 'car_fix'

    def __str__(self):
        return self.car.number


# 维修配件
class CarFixAccManage(models.Model):
    station_id = models.IntegerField(blank=True, null=True)
    fix = models.ForeignKey('CarFixManage', on_delete=models.CASCADE, related_name='fix_acc', null=True)
    # 记录下配件信息，而不是外键，这样保证存留历史快照
    name = models.CharField(max_length=50, blank=True)
    sn = models.CharField(max_length=50, blank=True)
    type = models.CharField(max_length=30, null=True)
    price = models.SmallIntegerField(blank=True, null=True)
    usage = models.SmallIntegerField(default=1)
    cost = models.FloatField(default=0)
    guarantee = models.BooleanField(default=False)
    guarantee_price = models.FloatField('三包价', default=0)
    guarantee_time = models.FloatField('工时', default=0)
    guarantee_time_fee = models.FloatField('工时费', default=0)
    old_id = models.IntegerField(verbose_name="old_id", null=True, blank=True)

    class Meta:
        db_table = 'fix_acc'

    def __str__(self):
        return self.name


# gurantee table unit is acc
class Gurantee(models.Model):
    order_no = models.CharField('单号', max_length=50)
    apply_date = models.DateTimeField(null=True)
    check_date = models.DateTimeField(null=True)
    repair_type = models.CharField('维修类型', max_length=10)
    gurantee_type = models.CharField('索赔类型', max_length=10)
    check_state = models.CharField('审核状态', max_length=50)
    car_sn = models.CharField('VIN', max_length=50)
    car_type = models.CharField('车型', max_length=50)
    acc_sn = models.CharField('配件代码', max_length=50)
    acc_name = models.CharField('配件名称', max_length=50)
    acc_unit = models.FloatField('配件单价', default=0)
    acc_count = models.FloatField('配件数', default=0)
    acc_fee = models.FloatField('配件费', default=0)
    guarantee_unit = models.FloatField('工时单价', default=0)
    guarantee_time = models.FloatField('工时数', default=0)
    guarantee_time_fee = models.FloatField('工时费', default=0)
    event_fee = models.FloatField('活动费', default=0)
    material_fee = models.FloatField('辅料费', default=0)
    special_fee = models.FloatField('特殊费', default=0)
    total_fee = models.FloatField('总金额', default=0)

    class Meta:
        db_table = 'gurantee'

    def __str__(self):
        return self.order_no
