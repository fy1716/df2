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
    em_type = models.SmallIntegerField(choices=EMPLOYEE_TYPE, help_text="类型", default=1)
    remark = models.CharField(max_length=48, null=True, blank=True, default='')

    class Meta:
        db_table = 'employee'

    def __str__(self):
        return self.name

