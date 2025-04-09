from django.db import models

##############################
# Warehouse
##############################


class Category(models.Model):
    """
    Model representing a test category.
    """
    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"

    name = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.name


class Type(models.Model):
    """
    Model representing a test type.
    """
    class Meta:
        unique_together = ('category', 'name')

    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='types')
    name = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return f"{self.category.name}: {self.name}"


class Batch(models.Model):
    """
    Model representing a batch of electrolysis cells.
    """
    class Meta:
        verbose_name = "batch"
        verbose_name_plural = "batches"

    name = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.name


class Cell(models.Model):
    """
    Model representing an electrolysis cell.
    """
    class Meta:
        unique_together = ('batch', 'name')

    batch = models.ForeignKey(
        Batch, on_delete=models.CASCADE, related_name='cells')
    name = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.batch.name}: {self.name}"

##############################
# Timeseries
##############################


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


class PWMTestdata(TimeseriesData):
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
