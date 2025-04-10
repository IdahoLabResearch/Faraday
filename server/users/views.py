# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
import json
from django.contrib.auth import authenticate


@csrf_exempt
@require_http_methods(["POST"])
def login(request):

    try:
        body: dict[str] = json.loads(request.body)

        username = body.get('user')
        password = body.get('password')

        user = authenticate(username=username, password=password)

        if (user):
            return JsonResponse({"data": model_to_dict(user)}, status=200, safe=False)

        return HttpResponse('Unauthorized', status=401)
    except Exception as e:
        return HttpResponse(e, status=500)
