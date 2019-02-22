from django.db import models


# 车辆信息
class CarInfoManage(models.Model):
    station_id = models.IntegerField()
    id_number = models.CharField(max_length=50)
    number = models.CharField(max_length=50, null=True)
    type = models.CharField(max_length=10, null=True)
    but_date = models.DateField(null=True)
    pro_date = models.DateField(null=True)
    owner = models.CharField(max_length=50, null=True)
    tel = models.CharField(max_length=15, null=True)
    remark = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'carInfo'


# 维修信息
class CarFixManage(models.Model):
    station_id = models.IntegerField()
    car_id = models.ForeignKey('CarInfoManage', on_delete=models.CASCADE, related_name='car_fix')
    odo = models.IntegerField(null=True)
    date = models.DateField()
    reg_time = models.CharField(max_length=24, null=True)
    income = models.SmallIntegerField(default=0, null=True)
    fix_man = models.CharField(max_length=16, null=True)
    remark = models.CharField(max_length=1024, null=True)
    logging = models.BooleanField(default=False)
    maintain = models.BooleanField(default=False)
    temp_id = models.IntegerField(default=0, null=True)

    class Meta:
        db_table = 'car_fix'


# 维修配件
class CarFixAccManage(models.Model):
    date = models.DateField(verbose_name='更换日期')
    station_id = models.IntegerField()
    fix_id = models.ForeignKey('CarFixManage', on_delete=models.CASCADE, related_name='fix_acc')
    # 记录下配件信息，而不是外键，这样保证存留历史快照
    name = models.CharField(max_length=50)
    id_number = models.CharField(max_length=50)
    type = models.CharField(max_length=30, blank=True)
    price = models.SmallIntegerField()
    usage = models.SmallIntegerField()
    cost = models.FloatField(default=0)
    guarantee = models.BooleanField(default=False)
    pid = models.CharField(max_length=128)
