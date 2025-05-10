# Postgres

Faraday uses Postgres for data warehousing and account management. It should use DeepLynx in the future

### Deployment

When developing locally, run `pg_dump -U postgres -d faraday --create --clean -f deployment.sql` inside the container. This creates a .sql file with all the data in the database. This data should be copied over to the `jumpazurehub` or `jumpazurehub2` jumpbox in the DMZ.

On the jumpbox, open a terminal and copy `deployment.sql` into the `faraday-db` pod.

Next, shell into the pod and run `psql` to load `deployment.sql` into the database.

### Maintenance

If this is not the first deployment, you may need to truncate the database before executing the above steps. However, truncating the database is only a valid option if the newly created `deployment.sql` contains all the data you intend to deploy.
