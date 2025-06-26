# Utilities
import os
import json

# Classes
from django.core.management.base import BaseCommand

# Import helpers
from django.db import transaction
from django.core.serializers import deserialize


class Command(BaseCommand):

    help = "Loads multiple json fixtures from a directory using bulk_create"

    def add_arguments(self, parser):
        parser.add_argument(
            "directory",
            type=str,
            help="Path to fixtures directory",
        )

    def handle(self, *args, **options):

        directory = options['directory']

        if not os.path.isdir(directory):
            self.stderr.write(f"Error: {directory} is not a valid directory")
            return

        fixtures = [f for f in os.listdir(directory) if f.endswith('.json')]

        if not fixtures:
            self.stderr.write(f"No valid JSON fixtures found in {directory}")
            return

        # Disable autocommit to control transaction
        with transaction.atomic():
            for fixture_file in fixtures:
                file_path = os.path.join(directory, fixture_file)
                self.stdout.write(f"Processing {fixture_file}...")

                try:
                    with open(file_path, 'r') as f:
                        fixture_data = json.load(f)

                    # Group objects by model
                    objects_by_model = {}
                    for obj in deserialize('json', json.dumps(fixture_data)):
                        model = obj.object.__class__
                        if model not in objects_by_model:
                            objects_by_model[model] = []
                        objects_by_model[model].append(obj.object)

                    # Perform bulk_create for each model
                    for model, objects in objects_by_model.items():
                        try:
                            model.objects.bulk_create(
                                objects, ignore_conflicts=True)
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"Successfully loaded {len(objects)} {model.__name__} objects"
                                )
                            )
                        except Exception as e:
                            self.stderr.write(
                                self.style.ERROR(
                                    f"Error loading {model.__name__} from {fixture_file}: {str(e)}"
                                )
                            )
                            raise  # Re-raise to trigger rollback

                except Exception as e:
                    self.stderr.write(
                        self.style.ERROR(
                            f"Error processing {fixture_file}: {str(e)}")
                    )
                    raise  # Re-raise to trigger rollback

        self.stdout.write(self.style.SUCCESS(
            "All fixtures loaded successfully"))
