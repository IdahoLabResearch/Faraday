import numpy as np
from scipy.special import expit
from scipy.stats import linregress


def fit_sre(data: list[dict]):

    x, y = zip(*[[float(n.get("time")), float(n.get("current_density"))] for n in data])
    sigmoid = expit(y)

    sre = [{"time": t, "sigmoid_current_density": s} for t, s in zip(x, sigmoid)]

    m, b = np.polyfit(x, sigmoid, 1)

    coefficients = [m, b]

    regression = [{"time": x, "regression": m*x + b} for x in x]


    return sre, regression, coefficients


