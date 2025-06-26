from django.urls import path, include
from . import views

urlpatterns = [
    path('cells', views.electrolysis_cell_data, name='cells'),
    path('stacks', views.electrolysis_stack_data, name="stacks"),
    path('statistics/', include('timeseries.statistics.urls')),
]
