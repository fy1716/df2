from rest_framework import mixins
from rest_framework import generics
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework import filters
from app.acc.models import AccManage
from app.acc.serializer import AccSerializer
from rest_framework.pagination import PageNumberPagination


# 根据page_size不同来获取数据的多少
class AccPagination(PageNumberPagination):
    page_size_query_param = 'page_size'


# '101': accdata.getData
class AccListViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                     mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = AccManage.objects.all()
    serializer_class = AccSerializer
    pagination_class = AccPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('-id',)
    search_fields = ('common_name', 'name', 'sn')
    filter_fields = ('name',)
