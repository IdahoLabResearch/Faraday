from ..models import Relationship


def graph(root_node):
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

    # Add children to the tree
    for relationship in Relationship.objects.filter(source_id=root_node.id):
        child_node = relationship.target
        child_node_data = graph(child_node)
        child_node_data['parent'] = root_node.name
        tree['children'].append(child_node_data)

    return tree
