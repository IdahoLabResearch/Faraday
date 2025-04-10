# Data Structures
bounds_low = {"a": 0.0, "b": -1.0, "M": 0.0, "M0": 0.0}
bounds_high = {"a": 0.1, "b": 5.0, "M": 1.0, "M0": 1e-6}

# Settings
genetic_alg_settings = {
    "population_size": 1000,
    "n_generations": 5000,
    "mu": 500,
    "lambda_": 300,
    "cxpb": 0.35,
    "mutpb": 0.65,
    "fitness_threshold": 1e-7,
    "avg_fitness_threshold": 5e-5,  # Average mean squared error
}

# Parameters
max_mechanisms = 5
n_bootstrap_samples = 50
parallelism = True
sample_rate = 2  # point(s) per hour
n_runs = 1
