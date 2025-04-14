from django.urls import path, include
from . import views

urlpatterns = [
    path('ontologies', views.ontologies),
    path('roots/<int:id>', views.roots),
    path('tree/<int:id>', views.tree),
]
