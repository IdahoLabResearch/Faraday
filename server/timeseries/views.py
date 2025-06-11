# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.db.models import Q
from django.db import connection
from django.http import JsonResponse
import json

# Models
from .models import ElectrolysisCell, ElectrolysisStack

# Helpers
from .helpers.cursor import CursorManager


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

    provider = body.get('provider')
    stackid = body.get('stackid')
    test = body.get('test')

    with connection.cursor() as c:
        c.execute("SELECT * FROM electrolysisstacks_downsampled WHERE provider=%s AND stackid=%s AND test=%s",
                  [provider, stackid, test])

        data = CursorManager.fetchall(c)

    return JsonResponse({'data': data})
