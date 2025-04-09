# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import HttpResponse, JsonResponse
from django.core.serializers import serialize
import json

from ..models import Category, Type, Batch, Cell


@csrf_exempt  # Django views can be exempt from CSRF vulnerabilities if they are function-based, e.g. don't handle any templates or HTML, see: https://docs.djangoproject.com/en/5.1/ref/csrf/#module-django.views.decorators.csrf
@require_http_methods(["GET"])
def categories(request):
    qs = list(Category.objects.all().values())
    return JsonResponse({'data': qs})


@csrf_exempt
@require_http_methods(["POST"])
def types(request):

    category = json.loads(request.body).get('category')

    qs = list(Type.objects.filter(category__name=category).values())
    return JsonResponse({'data': qs})


@csrf_exempt
@require_http_methods(["GET"])
def batches(request):

    qs = list(Batch.objects.all().values())

    return JsonResponse({'data': qs})


@csrf_exempt
@require_http_methods(["POST"])
def cells(request):

    batch = json.loads(request.body).get('batch')
    qs = list(Cell.objects.filter(batch__id=batch).values())
    return JsonResponse({'data': qs})
