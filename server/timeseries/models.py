from django.db import models
from warehouse.models import Type, Batch, Cell


class TimeseriesData(models.Model):
    """
    Base model for all timeseries data.
    """
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    cell = models.ForeignKey(Cell, on_delete=models.CASCADE)
    time = models.DecimalField(max_digits=255, decimal_places=12)

    class Meta:
        abstract = True


class ImpedanceTestData(TimeseriesData):
    """
    Model for impedance test data.
    """
    interval = models.IntegerField(max_length=3)
    sweep = models.IntegerField(max_length=3)
    frequency = models.DecimalField(max_digits=10, decimal_places=3)
    real_impedance = models.DecimalField(max_digits=10, decimal_places=8)
    imaginary_impedance = models.DecimalField(max_digits=10, decimal_places=8)

    class Meta:
        indexes = [
            models.Index(fields=['batch', 'cell']),
        ]


class PWMTestData(TimeseriesData):
    """
    Model for PWM test data.
    """
    time = models.DecimalField(max_digits=10, decimal_places=5)
    current_density = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        indexes = [
            models.Index(fields=['batch', 'cell']),
        ]


class PotentiostaticTestData(TimeseriesData):
    """
    Model for potentiostatic test data.
    """
    voltage = models.DecimalField(max_digits=10, decimal_places=5)
    current_density = models.DecimalField(max_digits=10, decimal_places=6)

    class Meta:
        indexes = [
            models.Index(fields=['batch', 'cell']),
        ]
