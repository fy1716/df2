# Generated by Django 2.1.4 on 2019-03-08 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AccBuyRecordManage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('station_id', models.SmallIntegerField()),
                ('date', models.DateField(null=True)),
                ('name', models.CharField(max_length=48, verbose_name='名称')),
                ('sn', models.CharField(max_length=30, verbose_name='件号')),
                ('cost', models.FloatField(default=0, null=True, verbose_name='材料费')),
                ('count', models.SmallIntegerField(null=True, verbose_name='数量')),
                ('total_cost', models.FloatField(default=0, null=True, verbose_name='总价')),
            ],
            options={
                'db_table': 'acc_buy_record',
            },
        ),
        migrations.CreateModel(
            name='AccManage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('station_id', models.IntegerField(null=True, verbose_name='站点ID')),
                ('common_name', models.CharField(blank=True, max_length=48, null=True, verbose_name='通用名')),
                ('name', models.CharField(max_length=48, verbose_name='名称')),
                ('sn', models.CharField(max_length=30, unique=True, verbose_name='件号')),
                ('type', models.CharField(blank=True, max_length=30, null=True, verbose_name='类型')),
                ('location', models.CharField(blank=True, max_length=30, null=True, verbose_name='存放位置')),
                ('cost', models.FloatField(default=0, verbose_name='材料费')),
                ('price', models.SmallIntegerField(verbose_name='售价')),
                ('count', models.SmallIntegerField(null=True, verbose_name='数量')),
                ('remark', models.CharField(blank=True, max_length=50, null=True, verbose_name='备注')),
                ('old_id', models.IntegerField(null=True, verbose_name='ord_id')),
            ],
            options={
                'verbose_name': '配件',
                'verbose_name_plural': '配件',
                'db_table': 'acc',
            },
        ),
        migrations.CreateModel(
            name='AccScanManage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('station_id', models.SmallIntegerField()),
                ('id_number', models.CharField(max_length=50)),
                ('pid', models.CharField(max_length=128)),
            ],
            options={
                'db_table': 'accScan',
            },
        ),
    ]