from django.db import models


# Create your models here.

class AccManage(models.Model):
    station_id = models.IntegerField(null=True, verbose_name="站点ID")
    common_name = models.CharField(max_length=48, null=True, verbose_name="通用名")
    name = models.CharField(max_length=48, verbose_name="名称")
    id_number = models.CharField(max_length=30, verbose_name="件号")
    type = models.CharField(max_length=30, null=True, verbose_name="类型")
    location = models.CharField(max_length=10, null=True, verbose_name="存放位置")
    cost = models.FloatField(null=True, default=0, verbose_name="材料费")
    price = models.SmallIntegerField(null=True, verbose_name="售价")
    count = models.SmallIntegerField(null=True, verbose_name="数量")
    remark = models.CharField(max_length=50, null=True, verbose_name="备注")

    class Meta:
        db_table = 'acc'


class AccScanManage(models.Model):
    station_id = models.SmallIntegerField()
    id_number = models.CharField(max_length=50)
    pid = models.CharField(max_length=128)
