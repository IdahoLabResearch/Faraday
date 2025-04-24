from . import views

from django.urls import path
from . import views

urlpatterns = [
    path('noor', views.sigmoid_regression, name='noor_sigmoid'),
    path('linear', views.linear_regression, name='linear'),
    path('sigmoid', views.scipy_sigmoid_regression, name='scipy_sigmoid'),
    path('pydrt', views.pydrt, name='drt'),
]
