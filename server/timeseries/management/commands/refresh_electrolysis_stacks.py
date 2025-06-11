# Classes
from django.core.management.base import BaseCommand

# Import helpers
from django.db import connection


class Command(BaseCommand):

    help = "Refreshes electrolysis stack materialized view"

    def add_arguments(self, parser):
        parser.add_argument(
            '--concurrently', action='store_true', help='Refresh concurrently')

    def handle(self, *args, **options):
        concurrently = options['concurrently']
        with connection.cursor() as cursor:
            query = "REFRESH MATERIALIZED VIEW CONCURRENTLY electrolysisstacks_downsampled;" if concurrently else "REFRESH MATERIALIZED VIEW electrolysisstacks_downsampled;"
            cursor.execute(query)
            self.stdout.write(self.style.SUCCESS(
                'Materialized view refreshed successfully'))
