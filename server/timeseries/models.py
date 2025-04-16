from django.db import models
from warehouse.models import Ontology, Node


class TimeseriesData(models.Model):
    """
    Base model for all timeseries data.
    """
    time = models.DecimalField(max_digits=255, decimal_places=12)
    date = models.DateField()

    class Meta:
        abstract = True


class ElectrolysisCell(TimeseriesData):
    """
    Model for electrolysis cells

    Add technical fields like electrolytes and electrodes here
    """
    provider = models.ForeignKey(
        Ontology, related_name='cell', on_delete=models.CASCADE)
    batch = models.ForeignKey(
        Node, related_name="cell_batch", on_delete=models.CASCADE
    )
    test = models.ForeignKey(
        Node, related_name='cell_test', on_delete=models.CASCADE)
    cell = models.ForeignKey(
        Node, related_name='cell_leaf', on_delete=models.CASCADE)


# class ElectrolysisStack(TimeseriesData):
#     """
#     Model for electrolysis stacks

#     Add technical fields like compression here
#     """
#     provider = models.ForeignKey(
#         Ontology, related_name='stack', on_delete=models.CASCADE)
#     root = models.ForeignKey(
#         Node, related_name='stack_test', on_delete=models.CASCADE)
#     leaf = models.ForeignKey(
#         Node, related_name='stack_leaf', on_delete=models.CASCADE)
#     name = models.CharField(max_length=25)
