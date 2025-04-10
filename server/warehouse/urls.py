from django.urls import path, include
import views

urlpatterns = [
    path('categories', views.categories),
    path('types', views.types),
    path('batches', views.batches),
    path('cells', views.cells),
]
