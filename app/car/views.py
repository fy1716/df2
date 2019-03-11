from django.forms.models import model_to_dict
from rest_framework import mixins
from rest_framework import filters
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework.exceptions import ValidationError

from app.acc.models import AccManage
from app.car.models import CarInfoManage, CarFixManage, CarFixAccManage
from app.car.serializer import CarInfoSerializer, CarFixSerializer, FixAccSerializer
from app.car.filters import CarInfoFilter, CarFixFilter, FixAccFilter
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
    # queryset = CarFixAccManage.objects.all()
    serializer_class = FixAccSerializer
    pagination_class = common_util.GeneralPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('-id',)
    filter_class = FixAccFilter

    @staticmethod
    def _check_duplicate(fix_id, sn):
        ret = CarFixAccManage.objects.filter(fix=fix_id, sn=sn).exists()
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
            # 获取维修负责人id
            fix_man_id = CarFixManage.objects.get(id=fix_id).fix_man_id
            data = model_to_dict(AccManage.objects.get(sn=id_number))
            acc = {k: data[k] for k in acc}
        except Exception as e:
            raise e
        fix_acc = CarFixAccManage(**acc, fix_id=fix_id, fix_man_id=fix_man_id)
        fix_acc.save()

    def perform_destroy(self, instance):
        instance.delete()

    # 在view中重写编辑方法，外键字段不要加_id
    def perform_update(self, serializer):
        common_util.debug(serializer)
        serializer.save()
