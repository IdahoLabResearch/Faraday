# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import JsonResponse
import json

from .models import Ontology


@csrf_exempt  # Django views can be exempt from CSRF vulnerabilities if they are function-based, e.g. don't handle any templates or HTML, see: https://docs.djangoproject.com/en/5.1/ref/csrf/#module-django.views.decorators.csrf
@require_http_methods(["GET"])
def ontologies(request):

    qs = list(Ontology.objects.all().values())
    return JsonResponse({'data': qs})


@csrf_exempt
@require_http_methods(["POST"])
def ontology(request):

    id = json.loads(request.body).get('ontology')
    ontology = Ontology.objects.filter(id=id).first()

    nodes = ontology.get_nodes()
    roots = ontology.get_roots()

    for r in roots:
        rel = r.get_relationships()
        print(rel)

    return JsonResponse({'data': {}})
