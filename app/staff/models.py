from django.db import models

EMPLOYEE_TYPE = (
    (1, "技师"),
    (2, "文员"),
    (3, "管理"),
    (4, "其他"),
)


# 员工
class EmployeeManage(models.Model):
    name = models.CharField(max_length=24)
    em_type = models.SmallIntegerField(choices=EMPLOYEE_TYPE, help_text="类型")
    remark = models.CharField(max_length=48, null=True)

    class Meta:
        db_table = 'employee'

    def __str__(self):
        return self.name


# 员工绩效
class EmployeeBonusManage(models.Model):
    date = models.DateField()
    employee = models.ForeignKey('EmployeeManage', on_delete=models.CASCADE)
    fix_id = models.ForeignKey('car.CarFixManage', on_delete=models.CASCADE, related_name='fix_bonus')
    acc_id = models.OneToOneField('car.CarFixAccManage', on_delete=models.CASCADE, related_name='acc_bonus', null=True)
    profit = models.FloatField()
    bonus = models.FloatField(default=0)

    class Meta:
        db_table = 'bonus'
        # unique_together = ('date', 'fix_id', 'acc_id')
