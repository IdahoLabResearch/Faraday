from django.urls import path, include
from .views import statistics, warehouse

urlpatterns = [
    path('sigmoid', statistics.sigmoid_regression, name='sigmoid'),
    path('statistics', statistics.statistics, name='statistics'),
    path('pydrt', statistics.pydrt, name='drt'),
    path('warehouse/', include([
        path('categories', warehouse.categories),
        path('types', warehouse.types),
        path('batches', warehouse.batches),
        path('cells', warehouse.cells),
    ])),
]
