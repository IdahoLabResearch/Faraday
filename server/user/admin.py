from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    fields = ['username', 'password', 'data_sources']
    list_display = ['username', 'data_sources']