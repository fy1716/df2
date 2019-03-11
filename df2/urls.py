"""df2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
import xadmin
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter
from car.views import CarInfoViewSet, CarFixViewSet, FixAccViewSet
from acc.views import AccListViewSet
from staff.views import EmployeeViewSet, EmployeeBonusListView
from rest_framework_jwt.views import obtain_jwt_token

router = DefaultRouter()
router.register(r'acc', AccListViewSet)
router.register(r'car_info', CarInfoViewSet, base_name='car_info')
router.register(r'car_fix', CarFixViewSet, base_name='car_fix')
router.register(r'fix_acc', FixAccViewSet, base_name='fix_acc')
router.register(r'employee', EmployeeViewSet)
router.register(r'employee_bonus', EmployeeBonusListView)

urlpatterns = [
    path('xadmin/', xadmin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('docs/', include_docs_urls(title='df2')),
    path('api/', include(router.urls)),
    path('login/', obtain_jwt_token),
    path('stat/', include('statistic.urls')),
    path('platform/', include('other.urls')),
]

urlpatterns = [
    re_path('^df/v2/', include(urlpatterns))
]
