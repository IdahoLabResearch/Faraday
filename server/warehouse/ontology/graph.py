from ..models import Relationship, Node
from timeseries.models import ElectrolysisCell


def graph(root_node: Node, tests: list[Relationship]):
    """
    Returns a JSON data structure that emulates the tree, with the root node at the top and its children underneath it.

    :param root_node: The root node of the tree.
    :return: A JSON data structure representing the tree.
    """

    tree = {}
    tree['name'] = root_node.name
    tree['cls'] = root_node.cls.name
    tree['ontology'] = root_node.ontology.name
    tree['parent'] = None
    tree['children'] = []

    for relationship in Relationship.objects.filter(source_id=root_node.id):
        child_node = relationship.target

        if (child_node.cls.name == "Cell"):

            qs = ElectrolysisCell.objects.filter(
                test="Pulse Width Modulation").values_list('cell', flat=True).distinct()

            if child_node.name in list(qs):
                print(f"{child_node.name} has {tests} data")
                child_node_data = graph(child_node, tests)
                child_node_data['parent'] = root_node.name
                tree['children'].append(child_node_data)
            else:
                continue
        else:
            child_node_data = graph(child_node, tests)

            if child_node_data == None:
                continue

            child_node_data['parent'] = root_node.name
            tree['children'].append(child_node_data)

    return tree
