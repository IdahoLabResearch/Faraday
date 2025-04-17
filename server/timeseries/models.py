from django.db import models
import uuid


class TimeseriesData(models.Model):
    """
    Base model for all timeseries data.
    """
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    time = models.DecimalField(max_digits=255, decimal_places=12)
    date = models.BigIntegerField()  # Unix time

    class Meta:
        abstract = True


class ElectrolysisCell(TimeseriesData):
    """
    Model for electrolysis cells

    Add technical fields like electrolytes and electrodes here
    """

    provider = models.CharField(max_length=25)
    test = models.CharField(max_length=25)
    batch = models.CharField(max_length=25)
    cell = models.CharField(max_length=25)
    data = models.JSONField()
    metadata = models.JSONField()

    class Meta:
        indexes = [
            models.Index(fields=['provider', 'test', 'batch', 'cell']),
        ]


# class ElectrolysisStack(TimeseriesData):
#     """
#     Model for electrolysis stacks

#     Add technical fields like compression here
#     """
#     provider = models.ForeignKey(
#         Ontology, related_name='stack', on_delete=models.CASCADE)
#     test = models.ForeignKey(
#         Node, related_name='stack_test', on_delete=models.CASCADE)
#     stack = models.ForeignKey(
#         Node, related_name='stack_leaf', on_delete=models.CASCADE)
#     data = models.JSONField()
#     metadata = models.JSONField()
