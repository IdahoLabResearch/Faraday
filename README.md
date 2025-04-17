# Faraday

### Getting Started

This application runs in [Docker](https://docs.docker.com/compose/install/).

In each `/app` `/database` and `/server/server` directories, copy the contents of their `.env.local.example` files into a new file called `.env.local`.

Then, in the root directory, run `docker compose build` and `docker compose up`.

### Development

To start developing, build and run the containers. At runtime, the containers each provision a dev environment that listens for code changes in their respective directories. Simply save your changes, and new code is automatically synced with the container application.

A default user is created at container runtime, with the following credentials:

- username/email: `admin`

- password: `admin`

Use this credential to log into the user interface and manage the server.

#### User Interface

The front-end is developed in React.

#### Server

The server application is developed using Django.

#### Database

The database is a Postgres database.

##### Backups

To create a backup of data you load into Postgres, you need to run a few commands. First, list running containers with `docker container ps`. The name of the postgres container should be `faraday-postgres-1`. Then, shell into the container by running `docker exec -it faraday-postgres-1 bash`. You should have shelled into the container. Next, run `pg_dump -U faraday > /usr/src/database/postgres/backups/$(date +%Y%m%d_%H%M%S).sql`

### Deployments

Once you've made changes to either the code or the database, it's time for a deployment.

If you've made changes to the data, you need to dump the database and move it into the `/database/postgres/init` directory. Name the SQL dump `init.sql`. When you deploy the application, the database will start up by reading in the data in `init.sql`.
