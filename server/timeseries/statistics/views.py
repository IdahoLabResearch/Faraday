# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
import pandas as pd
import numpy as np
from django.http import HttpResponse, JsonResponse
import json

# Statistics
from .drt.classes.EIS import Spectra
from .sre.sigmoid import Scipy_Sigmoid_Regression
from .noor.process import Noor_Sigmoid_Regression

# Cache
from django.core.cache import cache


@csrf_exempt
@require_http_methods(["POST"])
def sigmoid_regression(request):

    body = json.loads(request.body)

    name = body.get('name')
    timeseries = body.get('timeseries')

    if not (name and timeseries):
        return HttpResponse("Request missing cell name or timeseries data", status=400)

    cache_key = name
    data = cache.get(cache_key)

    if response is None:
        try:
            df = pd.DataFrame(timeseries)

            # Reconstruction of Life Metric Data
            time = df['data'].apply(
                lambda x: x.get('time')).values.astype(float)
            current_density = df['data'].apply(
                lambda x: x.get('current_density')).values.astype(float)

            ratio = [float(x / current_density[0]) for x in current_density]
            life_metric_data = 1 - np.array(ratio)

            response = Noor_Sigmoid_Regression(name, time, life_metric_data)
            cache.set(cache_key, data, 3600)  # Cache the result for 1 hour
        except Exception as e:
            return HttpResponse('Error processing cell data: {}'.format(e), status=500)

    return JsonResponse({'data': data})


@csrf_exempt
@require_http_methods(["POST"])
def scipy_sigmoid_regression(request):

    body = json.loads(request.body)

    name = body.get('name')
    timeseries = body.get('timeseries')

    data = [record.get('data') for record in timeseries]

    sre, regression, coefficients = Scipy_Sigmoid_Regression(data)

    return JsonResponse({'data': {'sre': sre, 'regression': regression, 'coefficients': coefficients}})


@csrf_exempt
@require_http_methods(["POST"])
def linear_regression(request):

    body = json.loads(request.body)
    x, y = zip(*[[n['data']["time"], n['data']['current_density']]
               for n in body])
    m, b = np.polyfit(x, y, 1)

    regression = [{'data': {"time": x, "regression": m*x + b}} for x in x]
    return JsonResponse({"data": {"fit": regression, "coefficients": [m, b]}})


@csrf_exempt
@require_http_methods(["POST"])
def pydrt(request):

    body: dict[str] = json.loads(request.body)
    timeseries: list[dict] = body.get("data")
    sweeps: list[str] = body.get("sweeps")

    drt = []

    for interval in sweeps:

        sweep = [s for s in timeseries if s.get(
            'metadata').get('sweep') == interval]

        # Parse the data into their respective numpy arrays
        frequency = np.array([d['metadata']['frequency'] for d in sweep])
        print(frequency)
        real_impedance = np.array(
            [d['data']['real_impedance'] for d in sweep])
        imaginary_impedance = np.array(
            [d['data']['imaginary_impedance'] for d in sweep])

        # Instantiate a pyDRT Spectra object using our data
        spectra = Spectra(frequency, real_impedance, imaginary_impedance)

        # Run the pyDRY analysis and return results
        spectra.simple_run()
        tau, gamma = spectra.results()

        results = [dict(tau=tau, gamma=gamma, sweep=interval)
                   for tau, gamma in list(zip(tau, gamma))]
        drt += results

    return JsonResponse(drt, safe=False)
