from django.urls import path, include
from . import views

urlpatterns = [
    path('cells', views.electrolysis_cell_data, name='cells'),
    path('statistics/', include('timeseries.statistics.urls')),
]
