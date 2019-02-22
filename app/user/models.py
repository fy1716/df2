from django.db import models
from django.utils import timezone


class UserManage(models.Model):
    station_id = models.IntegerField()
    username = models.CharField(max_length=128)
    password = models.CharField(max_length=256)
    role = models.SmallIntegerField()
    disable = models.BooleanField(default=False)
    code = models.CharField(max_length=48, null=True)
    position = models.CharField(max_length=24, null=True)
    telphone = models.CharField(max_length=24, null=True)
    created = models.DateTimeField(editable=False)
    lastLogin = models.DateTimeField()
    description = models.CharField(max_length=48, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = timezone.now()
        self.modified = timezone.now()
        return super(UserManage, self).save(*args, **kwargs)

    class Meta:
        db_table = 'user'


class StationManage(models.Model):
    name = models.CharField(max_length=128)
    desc = models.CharField(max_length=256, null=True)

    class Meta:
        db_table = 'station'
