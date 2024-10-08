# Use Alpine as the base image
FROM --platform=linux/amd64 alpine:latest

# Define the PocketBase version you want to use
ARG PB_VERSION=0.22.21

# Install required packages and set up certificates
RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Uncomment if you're using migrations
# COPY ./pb_migrations /pb/pb_migrations

# Uncomment if you're using custom hooks
# COPY ./pb_hooks /pb/pb_hooks

# Expose the default PocketBase port
EXPOSE 8080

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]