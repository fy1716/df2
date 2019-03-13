from rest_framework import mixins
from rest_framework import filters
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework_extensions.cache.mixins import CacheResponseMixin

from app.acc.models import AccManage
from app.acc.serializer import AccSerializer
from util import common_util


class AccListViewSet(viewsets.ModelViewSet):
    # 获取、编辑、删除都经过此过滤的数据，可用来针对用户的数据查询和操作
    queryset = AccManage.objects.all()
    # 数据校验、数据处理（存入数据库前）、获取参数、输出序列化、展示哪些数据
    serializer_class = AccSerializer
    # 分页
    pagination_class = common_util.GeneralPagination
    # 过滤
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    # 过滤-排序
    ordering_fields = ('id',)
    ordering = ('-id',)
    # 过滤-查询
    search_fields = ('common_name', 'name', 'sn')
    # 过滤-筛选（针对某个字段的范围，如日期范围，价格范围，关键词：范围）


class AccList1ViewSet(CacheResponseMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AccManage.objects.all()
    serializer_class = AccSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    # 过滤-排序
    ordering_fields = ('id',)
    ordering = ('-id',)
    # 过滤-查询
    search_fields = ('common_name', 'name', 'sn')
