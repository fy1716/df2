from rest_framework import mixins
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework.pagination import PageNumberPagination

from rest_framework import filters
from app.car.models import CarInfoManage, CarFixManage, CarFixAccManage
from app.car.serializer import CarInfoSerializer, CarFixSerializer, FixAccSerializer
from app.car.filters import CarInfoFilter, CarFixFilter, FixAccFilter


# 根据page_size不同来获取数据的多少
class CarPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 20


# '101': cardata.getData '102': cardata.getData '103': cardata.getData '104': cardata.getData
class CarInfoViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                     mixins.UpdateModelMixin, mixins.DestroyModelMixin):
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
    queryset = CarFixAccManage.objects.all()
    serializer_class = FixAccSerializer
    pagination_class = CarPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('-id',)
    filter_class = FixAccFilter
