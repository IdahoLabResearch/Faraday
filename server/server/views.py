# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import HttpResponse, JsonResponse


@csrf_exempt
@require_http_methods(["GET"])
def healthcheck(request):
    return JsonResponse({'host': request.get_host()}, status=200)
