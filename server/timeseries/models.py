from django.db import models

from warehouse.models import Type, Batch, Cell

# Create your models here.


class TimeseriesData(models.Model):
    """
    Base model for all timeseries data.
    """
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    cell = models.ForeignKey(Cell, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()

    class Meta:
        abstract = True


class ImpedanceTestData(TimeseriesData):
    """
    Model for impedance test data.
    """
    real_impedance = models.DecimalField(max_digits=10, decimal_places=5)
    imaginary_impedance = models.DecimalField(max_digits=10, decimal_places=5)

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
    time = models.DecimalField(max_digits=10, decimal_places=5)
    current_density = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        indexes = [
            models.Index(fields=['batch', 'cell']),
        ]
