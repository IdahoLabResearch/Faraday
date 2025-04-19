# Data Pipelines

Create a Jupyter notebook for each test type, for each data provider. These notebooks will extract, transform, and load data into their respective tables through the Django interface.

### Notebooks

In the notebook, import the data into a Pandas dataframe. Model the dataframe after the `ElectrolysisCell` or `ElectrolysisStack` models in `.timeseries.models`. Once you have formatted the dataframe accordingly, ensure you've added a `model` field and named it `timeseries.electrolysiscell` or `timeseries.electrolysisstack` respectively.

### Uploading Data

After you've crafted a Pandas dataframe to emulate a targeted model in `timeseries.models`, dump it to JSON. Then, load the data into Postgres as a fixture.

The command should look like this:

```
python manage.py loaddata --format json --app timeseries ./[provider]/[test]/[data].json
```

Where `provider` is the directory you've created to work with a provider's data, `test` is the name of the directory corresponding to the test type, and `data` is the name of the JSON file created by your Jupyter notebook.

### Deployments

Once the data has been uploaded, you can proceed with a deployment by dumping the database, and moving it to the `/database` directory at the root level. Follow instructions in the root `README.md`.
