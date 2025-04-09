# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.http import HttpResponse, JsonResponse
import json

# Math
import numpy as np
import pandas as pd

# pyDRT
from ..modules.drt.classes.EIS import Spectra

# sigmoid
from ..modules.sre.sigmoid import fit_sre

# noor
from ..modules.noor.process import process_cell


@csrf_exempt  # Django views can be exempt from CSRF vulnerabilities if they are function-based, e.g. don't handle any templates or HTML, see: https://docs.djangoproject.com/en/5.1/ref/csrf/#module-django.views.decorators.csrf
@require_http_methods(["POST"])
def sigmoid_regression(request):

    body = json.loads(request.body)
    cell = body.get('cell')
    data = body.get('data')

    if not (cell and data):
        return HttpResponse("Request missing cell name or timeseries data", status=400)

    try:
        df = pd.DataFrame(data)

        # Reconstruction of Life Metric Data
        time = df['time'].values.astype(float)
        current_density = df['current_density'].values.astype(float)

        ratio = current_density / current_density[0]
        life_metric_data = 1 - ratio

        response = process_cell(cell, time, life_metric_data)
    except Exception as e:
        return HttpResponse('Error processing cell data: {}'.format(e), status=500)

    return JsonResponse(response)


@csrf_exempt
@require_http_methods(["POST"])
def statistics(request):

    body = json.loads(request.body)
    x, y = zip(*[[float(n.get("time")), float(n.get("current_density"))]
               for n in body])
    m, b = np.polyfit(x, y, 1)

    regression = [{"time": x, "regression": m*x + b} for x in x]
    return JsonResponse({"data": {"regression": regression, "coefficients": [m, b]}})


@csrf_exempt
@require_http_methods(["POST"])
def pydrt(request):

    body: dict[str] = json.loads(request.body)
    data: list[dict] = body.get("data")
    sweeps: list[str] = body.get("sweeps")

    drt = []

    for interval in sweeps:

        sweep = [s for s in data if s.get('time') == int(interval)]

        # Parse the data into their respective numpy arrays
        frequency = np.array([float(d['frequency']) for d in sweep])
        real_impedance = np.array([float(d['real_impedance']) for d in sweep])
        imaginary_impedance = np.array(
            [float(d['imaginary_impedance']) for d in sweep])

        # Instantiate a pyDRT Spectra object using our data
        spectra = Spectra(frequency, real_impedance, imaginary_impedance)

        # Run the pyDRY analysis and return results
        spectra.simple_run()
        tau, gamma = spectra.results()

        results = [dict(tau=tau, gamma=gamma, sweep=interval)
                   for tau, gamma in list(zip(tau, gamma))]
        drt += results

    return JsonResponse(drt, safe=False)
