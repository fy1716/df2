from django.db import models


# Create your models here.

class BalanceManage(models.Model):
    station_id = models.IntegerField()
    date = models.DateField()
    balanceInOut = models.BooleanField(default=False)
    amount = models.FloatField()
    remark = models.CharField(max_length=1024)

    class Meta:
        db_table = 'balance'
