# server

## Running with Docker
1. **Build the Dokcker Image**: Build the Docker image locally.

```bash
docker build -t notify-med-server:latest .
```

2. **Run the Docker Container**:
After building th image, you can run the application in a container .

```bash
docker run \
    -p 4000:4000 \
    -e MONGO_URI=mongodb://your-database-ip/NotifyMEd \ 
    -d \
    server-app:latest
```

3. Access the application on `http://localhost:4000`.

## Environmental variables

You can also pass other environmenetal variabbles usinf the `-e` flag with docker run. For example, to set `JWT_SECRET`, you can add `-e JWT_SECRET=your_secret_here` to the `docker run` command.