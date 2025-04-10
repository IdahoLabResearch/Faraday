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
