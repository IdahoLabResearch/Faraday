# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import JsonResponse
from .ontology.graph import graph

# Models
from .models import Ontology, Node, Relationship


@csrf_exempt
@require_http_methods(["GET"])
def ontologies(request):

    qs = list(Ontology.objects.all().values())
    return JsonResponse({'data': qs})


@csrf_exempt
@require_http_methods(["GET"])
def roots(request, id):

    ontology = Ontology.objects.filter(id=id).first()

    roots = list(ontology.get_roots().values())

    return JsonResponse({'data': roots})


@csrf_exempt
@require_http_methods(["GET"])
def tree(request, id):

    trees = []

    root = Node.objects.filter(id=id).first()

    branches = list(Relationship.objects.filter(source__id=root.id))

    for branch in branches:
        branch = Node.objects.get(id=branch.target.id)
        trees.append(graph(branch, branch.name))

    return JsonResponse({'data': trees})
