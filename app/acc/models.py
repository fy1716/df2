from django.db import models


# Create your models here.
# 配件
class AccManage(models.Model):
    station_id = models.IntegerField(null=True, verbose_name="站点ID")
    common_name = models.CharField(max_length=48, null=True, blank=True, verbose_name="通用名", default="")
    name = models.CharField(max_length=48, verbose_name="名称")
    sn = models.CharField(max_length=30, unique=True, verbose_name="件号")
    type = models.CharField(max_length=30, null=True, blank=True, verbose_name="类型")
    location = models.CharField(max_length=30, null=True, blank=True, verbose_name="存放位置")
    cost = models.FloatField(default=0, verbose_name="材料费")
    price = models.SmallIntegerField(verbose_name="售价")
    count = models.SmallIntegerField(null=True, verbose_name="数量", default=0)
    remark = models.CharField(max_length=50, null=True, blank=True, verbose_name="备注")
    old_id = models.IntegerField(verbose_name="ord_id", null=True)

    class Meta:
        db_table = 'acc'
        verbose_name = '配件'
        verbose_name_plural = verbose_name


# 配件扫描
class AccScanManage(models.Model):
    station_id = models.SmallIntegerField()
    id_number = models.CharField(max_length=50)
    pid = models.CharField(max_length=128)

    class Meta:
        db_table = 'accScan'


# 进货记录
class AccBuyRecordManage(models.Model):
    station_id = models.SmallIntegerField()
    date = models.DateField(null=True, verbose_name="日期")
    name = models.CharField(max_length=48, verbose_name="名称")
    sn = models.CharField(max_length=30, verbose_name="件号")
    cost = models.FloatField(null=True, default=0, verbose_name="材料费")
    count = models.SmallIntegerField(null=True, verbose_name="数量")
    total_cost = models.FloatField(null=True, default=0, verbose_name="总价")

    class Meta:
        db_table = 'acc_buy_record'
