from ..models import Relationship, Node
from timeseries.models import ElectrolysisCell


def graph(branch: Node, test: str):
    """
    Returns a JSON data structure that emulates the tree, with the root node at the top and its children underneath it.

    :param root_node: The branch of the tree.
    :param test: The name of the branch.
    :return: A JSON data structure representing the tree.
    """

    tree = {}
    tree['name'] = branch.name
    tree['cls'] = branch.cls.name
    tree['ontology'] = branch.ontology.name
    tree['parent'] = None
    tree['children'] = []

    for relationship in Relationship.objects.filter(source_id=branch.id):
        child_node = relationship.target

        if (child_node.cls.name == "Cell"):
            # Check whether the cell has test data, for example if some cells in a batch haven't completed this test yet
            qs = ElectrolysisCell.objects.filter(
                test=test, batch=branch.name).values_list('cell', flat=True).distinct()

            if child_node.name in list(qs):
                child_node_data = graph(child_node, test)
                child_node_data['parent'] = branch.name
                tree['children'].append(child_node_data)
            else:
                continue
        else:
            child_node_data = graph(child_node, test)

            if child_node_data:
                child_node_data['parent'] = branch.name
                tree['children'].append(child_node_data)

    return tree
