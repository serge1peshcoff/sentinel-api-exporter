# sentinel-api-exporter

Reads Sentinel validator data from the API and exports it in a Prometheus format.

## How to run it?
1. Clone this repo and `cd` there
2. Build the container:

```
docker build -t sentinel-api-exporter .
```

3. Run the container (for configuration, see below):

```
docker run -it \
    -d --name=sentinel-api-exporter \
    -p 3032:3032 \
    --label com.centurylinklabs.watchtower.enable=false \ # so it won't be restarter by Watchtower if it's running
    --restart unless-stopped \ # so it would start together with the system
    sentinel-api-exporter
```

4. Open `http://localhost:3030` in browser, it should display metrics.
5. If there were errors, check out the container logs.


## Configration

All the configuration is done through the environmental variables.
- `LOG_LEVEL` - integration logging level. Default: `warn`. If something isn't working, try setting it to `debug` and check what's inside.
