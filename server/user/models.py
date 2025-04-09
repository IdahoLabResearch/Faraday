from django.db.models import JSONField
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    data_sources = JSONField(
        blank=True,
        default=list,
        help_text="An array of data sources a user has permissions to"
    )

