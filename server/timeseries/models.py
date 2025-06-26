from django.db import models
import uuid


class TimeseriesData(models.Model):
    """
    Base model for all timeseries data.

    UUID: A primary key for the SQL database (the Django ORM takes care of this for you)
    Date: The date of the experiment, in Unix time
    """
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    date = models.BigIntegerField()

    class Meta:
        abstract = True


class ElectrolysisCell(TimeseriesData):
    """
    Model for electrolysis cells

    Provider: The name of the organization providing the data
    Test: The test type which generated this data
    Batch: The name of the cell batch
    Data: The data which composes the chart, for example dependent and independent variables in the experiment
    Metadata: The metadata about the cell, or about the experiment parameters
    """

    provider = models.CharField(max_length=25)
    test = models.CharField(max_length=25)
    batch = models.CharField(max_length=25)
    cell = models.CharField(max_length=25)
    data = models.JSONField()
    metadata = models.JSONField(null=True)

    class Meta:
        indexes = [
            models.Index(fields=['provider', 'test', 'batch', 'cell']),
        ]


class ElectrolysisStack(TimeseriesData):
    """
    Model for electrolysis stacks

    Provider: The name of the organization providing the data
    Test: The test type which generated this data
    Stack: The name of the cell batch
    Data: The data which composes the chart, for example dependent and independent variables in the experiment
    Metadata: The metadata about the cell, or about the experiment parameters
    """
    provider = models.CharField(max_length=25)
    test = models.CharField(max_length=25)
    stackid = models.CharField(max_length=25)
    data = models.JSONField()
    metadata = models.JSONField(null=True)

    class Meta:
        indexes = [
            models.Index(fields=['provider', 'test', 'stackid']),
        ]
