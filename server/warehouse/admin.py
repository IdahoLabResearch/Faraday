from django.contrib import admin
from .models import Node, Relationship, Ontology, Class


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['name', 'cls', 'ontology']
    search_fields = ['name', 'cls', 'ontology']
    list_filter = ['cls']


@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ['name', 'source', 'target', 'ontology']
    search_fields = ['name']
    list_filter = ['name', 'ontology']


@admin.register(Ontology)
class OntologyAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'ontology']
    search_fields = ['name', 'ontology']
    list_filter = ['name', 'ontology']
