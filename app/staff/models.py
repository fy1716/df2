from django.db import models


# 员工
class EmployeeManage(models.Model):
    name = models.CharField(max_length=24)
    type = models.CharField(max_length=8)
    remark = models.CharField(max_length=48, null=True)

    class Meta:
        db_table = 'employee'


# 员工绩效
class EmployeeBonusManage(models.Model):
    date = models.DateField()
    employee = models.ForeignKey('EmployeeManage', on_delete=models.CASCADE)
    fix_id = models.ForeignKey('car.CarFixManage', on_delete=models.CASCADE, related_name='fix_bonus')
    acc_id = models.OneToOneField('car.CarFixAccManage', on_delete=models.CASCADE, related_name='acc_bonus')
    profit = models.FloatField()
    bonus = models.FloatField(default=0)

    class Meta:
        db_table = 'bonus'
