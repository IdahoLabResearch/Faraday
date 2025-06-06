from django.contrib import admin
from .models import Node, Relationship, Ontology, Class
from django import forms


class RelationshipForm(forms.ModelForm):

    class Meta:
        model = Relationship
        fields = ['ontology', 'source', 'target']


@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ['ontology', 'source', 'target']
    list_filter = ['ontology']

    form = RelationshipForm


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['ontology', 'name', 'cls']
    list_filter = ['cls']


@admin.register(Ontology)
class OntologyAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['ontology', 'name', ]
    list_filter = ['ontology', 'name', ]
