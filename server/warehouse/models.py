# Models
from django.db import models


class Ontology(models.Model):
    """
    Model for data provider
    """
    name = models.CharField(max_length=25, unique=True)

    class Meta:
        verbose_name = "ontology"
        verbose_name_plural = "ontologies"

    def __str__(self):
        return self.name

    def get_roots(self):
        return self.nodes.filter(root=True)

    def get_nodes(self):
        return self.nodes.all()

    def get_node_relationships(self, node):
        if node in self.nodes.all():
            return node.get_relationships()
        else:
            return None


class Class(models.Model):
    """
    Model for node class
    """
    name = models.CharField(max_length=25)
    description = models.CharField(max_length=25)
    ontology = models.ForeignKey(
        Ontology, related_name='classes', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "class"
        verbose_name_plural = "classes"
        unique_together = ['name', 'ontology']

    def __str__(self):
        return f"{self.ontology}: {self.name}"


class Node(models.Model):
    """
    Model for graph node
    """
    name = models.CharField(max_length=25)
    cls = models.ForeignKey(
        Class, related_name='nodes', on_delete=models.CASCADE
    )
    ontology = models.ForeignKey(
        Ontology, related_name='nodes', on_delete=models.CASCADE
    )
    root = models.BooleanField(
        default=False, help_text="Imporant: Faraday nodes are roots only if their cls is a Category")

    class Meta:
        unique_together = ('name', 'cls', 'ontology')

    def __str__(self):
        return f"{self.ontology}: {self.name} ({self.cls})"


class Relationship(models.Model):
    """
    Model for graph relationship
    """
    source = models.ForeignKey(
        Node, related_name='source', on_delete=models.CASCADE
    )
    target = models.ForeignKey(
        Node, related_name='target', on_delete=models.CASCADE
    )
    ontology = models.ForeignKey(
        Ontology, related_name='relationships', on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('source', 'target', 'ontology')

    def __str__(self):
        return f"{self.source} -> {self.target}"
