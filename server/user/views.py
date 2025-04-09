# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import HttpResponse, JsonResponse
import json
from django.contrib.auth import authenticate

# Requests
import requests

# Encryption
from cryptography.fernet import Fernet
from pathlib import Path
import os
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env.local'))


@csrf_exempt
@require_http_methods(["POST"])
def login(request):

    return
