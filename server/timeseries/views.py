# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.db.models import Q
from django.http import JsonResponse
import json

# Models
from .models import ElectrolysisCell, ElectrolysisStack


@csrf_exempt
@require_http_methods(['POST'])
def electrolysis_cell_data(request):

    body = json.loads(request.body)

    cell = Q(cell=body.get('cell'))
    batch = Q(batch=body.get('batch'))
    test = Q(test=body.get('test'))
    provider = Q(provider=body.get('provider'))

    query = cell & batch & test & provider

    data = list(ElectrolysisCell.objects.filter(query).values())

    return JsonResponse({'data': data})


@csrf_exempt
@require_http_methods(['POST'])
def electrolysis_stack_data(request):

    body = json.loads(request.body)

    stackid = Q(stackid=body.get('stackid'))
    provider = Q(provider=body.get('provider'))
    test = Q(test=body.get('test'))

    query = stackid & test & provider

    data = list(ElectrolysisStack.objects.filter(query).values())

    return JsonResponse({'data': data})
