from django.urls import path, include
from . import views

urlpatterns = [
    path('cells', views.electrolysis_cell_data, name='cells'),
    path('sigmoid', views.sigmoid_regression, name='sigmoid'),
    path('linear', views.linear_regression, name='linear'),
    path('pydrt', views.pydrt, name='drt'),
]
