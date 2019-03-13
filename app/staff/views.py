from rest_framework import mixins
from rest_framework import viewsets
import django_filters.rest_framework
from rest_framework import filters

from app.staff.models import EmployeeManage, SubSite
from app.car.models import EmployeeBonusManage
from app.staff.filters import EmployeeBonusFilter
from app.staff.serializer import EmployeeSerializer, EmployeeBonusSerializer, SubSiteSerializer


# '': get_employee
class EmployeeViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                      mixins.CreateModelMixin,
                      mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = EmployeeManage.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('id',)
    search_fields = ('name',)


class EmployeeBonusListView(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin,
                            mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = EmployeeBonusManage.objects.all()
    serializer_class = EmployeeBonusSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_field = EmployeeBonusFilter
    ordering_fields = ('id',)
    ordering = ('-id',)
    search_fields = ('employee__name',)


class SubSiteViewSet(viewsets.ModelViewSet):
    queryset = SubSite.objects.all()
    serializer_class = SubSiteSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id',)
    ordering = ('id',)
    search_fields = ('name',)
