from django.db import models


# Create your models here.

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
    remark = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'carInfo'
