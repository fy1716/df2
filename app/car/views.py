from django.forms.models import model_to_dict
from rest_framework import mixins
from rest_framework import filters
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework.exceptions import ValidationError

from app.acc.models import AccManage
from app.car.models import CarInfoManage, CarFixManage, CarFixAccManage, Gurantee
from app.car.serializer import CarInfoSerializer, CarFixSerializer, FixAccSerializer, GuaranteeSerializer
from app.car.filters import CarInfoFilter, CarFixFilter, FixAccFilter, GuaranteeFilter
from util import common_util


class CarInfoViewSet(viewsets.ModelViewSet):
    queryset = CarInfoManage.objects.all()
    serializer_class = CarInfoSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = CarInfoFilter
    # 新增的放最前边
    ordering_fields = ('id',)
    ordering = ('-id',)
    # 搜索字段， 对应到前端的参数是 search
    search_fields = ('sn', 'number', 'owner', 'type', 'tel', 'remark')


class CarFixViewSet(viewsets.ModelViewSet):
    queryset = CarFixManage.objects.all()
    serializer_class = CarFixSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = CarFixFilter
    ordering_fields = ('id',)
    ordering = ('-id',)
    search_fields = ('car__sn', 'car__number', 'car__owner', 'fix_man__name')  # 维修人员、车牌、车架、车主


class FixAccViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                    mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = FixAccSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('-id',)

    @staticmethod
    def _check_duplicate(fix_id, sn):
        ret = CarFixAccManage.objects.filter(fix=fix_id, sn=sn).exists()
        return ret

    def get_queryset(self):
        fix_id = self.request.data.get('car_fix_id') or self.request.query_params.get('car_fix_id')
        query_set = CarFixAccManage.objects.filter(fix_id=fix_id)
        return query_set


class GuaranteeViewSet(viewsets.ModelViewSet):
    queryset = Gurantee.objects.all()
    serializer_class = GuaranteeSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = GuaranteeFilter
    # 新增的放最前边
    ordering_fields = ('apply_date',)
    ordering = ('-apply_date',)
    # 搜索字段， 对应到前端的参数是 search
    search_fields = ('car_sn',)
