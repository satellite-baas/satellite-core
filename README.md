# Core

This repository contains the code and configuration for launching a single Satellite application stack, which includes the following components:

- **Graph database (dGraph)** for data persistence. Operations are performed on the database using standard GraphQL queries and mutations. Queries and mutations are automatically generated from a GraphQL SDL schema, which can be provided at run time.
- **Application server (NodeJS - Express)** for access control to the database, and an endpoint for static file uploads. Access control is acheived using API keys set on the requests coming to the database. The API key must be set in the request header as `X-API-Key`.
- **Web server (nginx)** for serving the static file uploads.

## Usage

### Environment Varaibles

Deployment of this stack using docker swarm requires 3 environment variables to be set:

- `DOMAIN`: The domain name where the application is hosted. For example, if the application is hosted at _app.satellite.com_, the `DOMAIN` is _satellite.com_.
- `SATNAME`: The name of the "satellite" application. This should be the subdomain that the application will be accessible on. In the case of _app.settlite.com_, the subdomain is _app_.
- `APIKEY`: The API key that will be used by the application server to determine if incoming requests should be allowed through to the database - or denied access.

The included `.env_template` file can be edited as approprated and renamed to `.env` to facillitate setting these environment variables for a stand-alone deployment in a testing environment (see below - deployment).

### Endpoints

With this stack successfully deployed, the following endpoints are made accessible via the public internet:

- `/graphql` for interacting with the graphql api
- Any other endpoint is handle by the static file server. A file matching the path is served, or a 404 response.

### Networking

Deployment of this stack requires two existing overlay networks to be present on the swarm: `backend` and `proxy`.

The `backend` network is an internal network that can be used for the following administrative actions. These actions should be performed by applications on the same internal network, where the user has been authenticated appropriately.

- Updating the GraphQL schema defintion by issuing a post request to `http://alpha_${SATNAME}:8080/admin/schema`.
- Uploading static files by issuing a post request to `http://app_${SATNAME}:5000/upload`.
- A JSON listing of the static files currently stored on the server can be obtained by sending a GET request to `http://app_${SATNAME}:5000/files`.

The `proxy` network allows access from an edge router to route requests to the GraphQL API via the `/graphql` path, or to the static file server for all other paths.

The internal `stack` network is used by the application server in order to proxy requests to the database after verifying the correct API key is present on the incoming request header (`X-API-Key`).

### Deployment

To deploy as a stand-alone stack for testing, the following command can be used:

`set -a && . .env && set +a && docker stack deploy -c docker-stack.yml <stackName>`

...where `<stackName>` is the desired name of the stack. As per the networking section above, this will only work if there is an existing `proxy` and `backend` overlay network present on the system. The environment variables for the stack will be read from the `.env` file.

Programmatic access should set the environment variables as needed for deploying the stack file.
