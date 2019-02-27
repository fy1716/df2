from rest_framework import mixins
from rest_framework import generics
from rest_framework import viewsets
import django_filters.rest_framework
from app.acc.models import AccManage
from app.acc.serializer import AccSerializer
from rest_framework.pagination import PageNumberPagination


class AccPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class AccListViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = AccManage.objects.all()
    serializer_class = AccSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_fields = ('name',)
