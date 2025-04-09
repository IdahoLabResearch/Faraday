from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email',
                    'is_staff', 'is_active', 'date_joined', 'is_superuser']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
        ('Important dates', {'fields': ('date_joined', 'last_login')}),
        ('Groups and permissions', {'fields': ('groups', 'user_permissions')}),
        ('Data sources', {'fields': ('data_sources',)}),
    )
