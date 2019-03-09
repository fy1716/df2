from django.forms.models import model_to_dict
from rest_framework import mixins
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError

from rest_framework import filters
from app.acc.models import AccManage
from app.car.models import CarInfoManage, CarFixManage, CarFixAccManage
from app.car.serializer import CarInfoSerializer, CarFixSerializer, FixAccSerializer
from app.car.filters import CarInfoFilter, CarFixFilter, FixAccFilter
from util import common_util


# 根据page_size不同来获取数据的多少
class CarPagination(PageNumberPagination):
    page_size_query_param = 'rows'
    max_page_size = 20


# '101': cardata.getData '102': cardata.getData '103': cardata.getData '104': cardata.getData
class CarInfoViewSet(viewsets.ModelViewSet):
    queryset = CarInfoManage.objects.all()
    serializer_class = CarInfoSerializer
    pagination_class = CarPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = CarInfoFilter
    ordering_fields = ('id',)
    ordering = ('-id',)
    search_fields = ('sn', 'number', 'owner', 'type', 'tel', 'remark')

    # def get_queryset(self):
    #     print(self.request.query_params.get('station_id'))
    #     query_set = CarInfoManage.objects.filter(station_id=self.request.query_params.get('station_id'))
    #     return query_set


class CarFixViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                    mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = CarFixManage.objects.all()
    serializer_class = CarFixSerializer
    pagination_class = CarPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = CarFixFilter
    ordering_fields = ('id',)
    ordering = ('-id',)
    search_fields = ('car__sn', 'car__number', 'car__owner', 'fix_man__name')  # 维修人员、车牌、车架、车主


class FixAccViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                    mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    # queryset = CarFixAccManage.objects.all()
    serializer_class = FixAccSerializer
    pagination_class = CarPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('-id',)
    filter_class = FixAccFilter

    @staticmethod
    def _check_duplicate(fix_id, sn):
        ret = CarFixAccManage.objects.filter(fix=fix_id, sn=sn)
        common_util.debug(ret)
        return ret

    def get_queryset(self):
        fix_id = self.request.data.get('car_fix_id') or self.request.query_params.get('car_fix_id')
        query_set = CarFixAccManage.objects.filter(fix_id=fix_id)
        return query_set

    def perform_create(self, serializer):
        fix_id = self.request.data['fix_id']
        id_number = self.request.data['id_number']
        if self._check_duplicate(fix_id, id_number):
            raise ValidationError('该配件已添加，请检查!')
        acc = {
            "sn": id_number,
            "name": '',
            "type": '',
            "price": 0,
            "cost": 0,
        }
        try:
            data = model_to_dict(AccManage.objects.get(sn=id_number))
            acc = {k: data[k] for k in acc}
        except Exception as e:
            raise e
        fix_acc = CarFixAccManage(**acc, fix_id=fix_id)
        fix_acc.save()

    def perform_destroy(self, instance):
        instance.delete()

    # 在view中重写编辑方法，外键字段不要加_id
    def perform_update(self, serializer):
        common_util.debug(serializer)
        serializer.save()
