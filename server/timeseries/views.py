# Decorators
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Utilities
from django.db.models import Q
import pandas as pd
import numpy as np
from django.http import HttpResponse, JsonResponse
import json

# Models
from .models import ElectrolysisCell

# Statistics
from .statistics.drt.classes.EIS import Spectra
from .statistics.sre.sigmoid import fit_sre
from .statistics.noor.process import process_cell


@csrf_exempt
@require_http_methods(['POST'])
def electrolysis_cell_data(request):

    body = json.loads(request.body)
    print(body)

    cell = Q(cell=body.get('cell'))
    batch = Q(batch=body.get('batch'))
    test = Q(test=body.get('test'))
    provider = Q(provider=body.get('provider'))

    query = cell & batch & test & provider

    data = list(ElectrolysisCell.objects.filter(query).values())

    return JsonResponse({'data': data})


@csrf_exempt
@require_http_methods(["POST"])
def sigmoid_regression(request):

    body = json.loads(request.body)
    name = body.get('name')
    timeseries = body.get('timeseries')

    if not (name and timeseries):
        return HttpResponse("Request missing cell name or timeseries data", status=400)

    try:
        df = pd.DataFrame(timeseries)

        # Reconstruction of Life Metric Data
        time = np.array(df['data'].map(lambda x: x.get('time')))
        current_density = np.array(df['data'].map(
            lambda x: x.get('current_density')))

        ratio = current_density / current_density[0]
        life_metric_data = 1 - ratio

        response = process_cell(name, time, life_metric_data)
    except Exception as e:
        return HttpResponse('Error processing cell data: {}'.format(e), status=500)

    return JsonResponse(response)


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
