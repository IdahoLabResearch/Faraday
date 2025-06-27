from django.urls import path
from . import views

urlpatterns = [
    path('ontologies', views.ontologies, name="providers"),
    path('roots/<int:id>', views.roots, name="categories"),
    path('tree/<int:id>', views.tree, name="graph"),
]
