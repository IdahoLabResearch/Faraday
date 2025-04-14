# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import JsonResponse

from .models import Ontology, Node

from .ontology.graph import graph


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

    source = Node.objects.filter(id=id).first()

    tree = graph(source)

    return JsonResponse({'data': tree})
