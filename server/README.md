# Faraday Server

The Faraday server application is developed with Django.

Each application manages its own respective namespace with respective models and views.

### Getting Started

##### Users

You need to create a superuser account to manage the data in the Django admin app, and also login through the Faraday user interface. This credential will only exist locally throughout the course of your development, and as long as you haven't truncated any data in the database, or removed the Docker volume.

Shell into the Django container and run `python manage.py createsuperuser` and follow the prompts.

For ease of development, and because this development credential is not a real credential, I just use a simple username and password, like _nathan_ and _admin_.

#### Fixtures

You should start by loading data into the database. A minimal and open-source subset of this data lives in the `/warehouse/fixtures` directory.

##### Warehouse

To load warehouse data, run the following command:

```
python manage.py loaddata --format json ./warehouse/fixtures/warehouse.json
```

This command loads ontology data into the warehouse. The Faraday database is now populated with providers, entities, and relationships.

##### Timeseries

To load timeseries data, copy fixtures into the `./timeseries/fixtures` directory and run the following commands:

```
python manage.py loaddata --format json ./timeseries/fixtures/{fixture.json}
```

## Applications

The core Faraday server side capabilities are organized into respective Python modules, or _applications_ in Django nomenclature.

### Server

This is the root application, which manages the server itself. Note that all application settings are dictated by the `settings.py` file, and all application routes pass through the `urls.py` file.

Other features like models, views, and fixtures should be developed into their respective applications.

### Timeseries

The timeseries application manages timeseries data in the Faraday database

### Users

The users application is for user management

### Warehouse

The warehouse application is for managing ontologies, nodes, relationships, and classes

## Deployments and Collaboration

### Backups

To create a backup of data you loaded into Postgres, you need to run a few commands.

In your terminal, first list running containers with `docker container ps`. The name of the server container should be `faraday-server-1`.

Then, shell into the container by running `docker exec -it faraday-server-1 sh`. You should have shelled into the container.

Read about the Django administrative command for exporting data from the database [here](https://docs.djangoproject.com/en/5.2/ref/django-admin/). This command creates a json file that you can upload to a backup location, and deploy to Faraday.

<span style="color:red">WARNING:</span> Do not commit any proprietary data to GitHub. The file generated above should be _gitignored_.

### Deployments

After the application is deployed, a developer needs to shell into `jumpazurehub2` and load any new fixtures into the deployed database instance.
