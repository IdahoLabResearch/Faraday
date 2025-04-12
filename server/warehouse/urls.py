from django.urls import path, include
from . import views

urlpatterns = [
    path('ontologies', views.ontologies),
    path('ontology', views.ontology)
]
