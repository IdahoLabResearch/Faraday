# Faraday Server

The Faraday server application is developed with Django.

Each application manages its own respective namespace with respective models and views.

### Getting Started

This application runs in a Python virtual environment, with database dependencies in Docker.

#### Environment Variables

Copy the contents of `/server/.env.local.example` into a new file called `.env.local`. Ensure these variables match those in the `.env.local` file in the Faraday `/database` directory.

#### Virtual Environments

Create a virutal environment in this directory and activate it.

Run `pip install -r requirements.txt` to install application dependencies.

#### Docker

Start the Postgres database, before proceeding, because its a dependency of the Django application. Run `docker compose build` and `docker compose up` in the root directory (above `/server`, where you found this `README.md`).

##### The Compose Stack

The `docker-compose.yaml` file is an instruction set which tells Docker how to build and run the application. These instructions also contain information about _volumes_.

###### Volumes

The volume is a small local partition managed by Docker which persists data in the database. Following the instructions below, after starting the app and loading fixtures into the database, the Postgres data will retain the data you've entered into the warehouse.

**Important**: A volume persists so long as you haven't taken _down_ the compose stack, by running `docker compose down`. Don't run this command unless you're certain you'd like to remove all data from your local Postgres. To simply stop the application stack, for example at the end of the day when you're ready to log off, simply hit `CTRL + C` in your terminal, or press the square "stop" button in Docker Desktop.

#### Running the app

Next, use the `manage.py` module to make or run migrations, and start the app. If you're developing on Faraday for the first time, you will need to `python manage.py migrate` to run migrations.

#### Fixtures

You should continue setup by loading data into the database. A minimal and open-source subset of this data lives in each Django application's `/fixtures` directory.

After running migrations, the Postgres database has a schema ready to accept data. For more information about the built-in utility for loading data, read about the [loaddata command](https://docs.djangoproject.com/en/5.2/ref/django-admin/#django-admin-loaddata).

For information about creating new fixtures to upload new data, visit the `README.md` in `./timeseries/fixtures`

##### Timeseries

To load timeseries data, run the following commands:

```
python manage.py loaddata --format json --app timeseries ./H2NEW/impedance/impedance.json

python manage.py loaddata --format json --app timeseries ./H2NEW/potentiostatic/potentiostatic.json

python manage.py loaddata --format json --app timeseries ./H2NEW/pwm/pwm.json
```

##### Warehouse

To load warehouse data, run the following command:

```
python manage.py loaddata --format yaml --app warehouse ./H2NEW.yaml
```

##### Users

You need to create a superuser account to manage the data in the Django admin app, and also login through the Faraday user interface. This credential will only exist locally throughout the course of your deployment, and as long as you haven't truncated any data in the warehouse, or removed the Docker volume (see the **Docker** section above)

Run `python manage.py createsuperuser` and follow the prompts. For ease of development, and because this development credential is not a real credential, I just use a simple username and password, like "nathan" and "admin".

## Applications

The core Faraday Server capabilities are organized into respective Python modules, or _applications_ in Django nomenclature.

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

In your terminal, first list running containers with `docker container ps`. The name of the postgres container should be `faraday-postgres-1`.

Then, shell into the container by running `docker exec -it faraday-postgres-1 bash`. You should have shelled into the container.

Next, run `pg_dump -U faraday > /usr/src/database/postgres/backups/$(date +%Y%m%d_%H%M%S).sql`

Notice that a new `.sql` file is now under `/database/postgres/backups`.

<span style="color:red">WARNING:</span> This workflow is subject to change. Do not commit any proprietary data to GitHub. The file generated above should already be _gitignored_.

### Deployments <span style="color:red">\*</span>

<span style="color:red">\*</span> To be revised later. Only public, open source data for now. See warning above.

If you've made changes to the data, you need to dump the database and move it into the `/database/postgres/init` directory. Name the SQL dump `init.sql`. When you deploy the application, the database will start up by reading in the data in `init.sql`.
