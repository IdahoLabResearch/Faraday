from django.contrib import admin
from .models import Category, Type, Batch, Cell


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category__name')
    list_filter = ('category',)


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Cell)
class CellAdmin(admin.ModelAdmin):
    list_display = ('name', 'batch')
    search_fields = ('name', 'batch__name')
    list_filter = ('batch',)
