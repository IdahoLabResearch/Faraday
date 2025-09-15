# Faraday

### Getting Started

This application runs in [Docker](https://docs.docker.com/compose/install/).

In each `/app` `/database` and `/server/server` directories, copy the contents of their `.env.local.example` files into a new file called `.env.local`.

Then, in the root directory, run `docker compose build` and `docker compose up`.

### Development

To start developing, build and run the containers. At runtime, the containers each provision a dev environment that listens for code changes in their respective directories. Simply save your changes, and new code is automatically synced with the container application.

For further instructions visit each respective `/app`, `/database`, or `/server` directory's `README.md`.

#### User Interface

The front-end is developed in React.

#### Server

The server application is developed using Django. To start developing, you will need to start the server, load any data you'd like to work with, and create a superuser.

#### Database

The database is a Postgres database.

### Cite Me

```
Woodruff, N., Kane, N., Hartvigsen, J., Casteel, M., Rahman, N., & Sahin, E. (2025). Faraday [Computer software]. GitHub. https://github.com/IdahoLabResearch/Faraday
```
