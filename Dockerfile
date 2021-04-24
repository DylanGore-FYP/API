## build stage ##
FROM node:15-alpine as build-stage
# LABEL maintainer="Dylan Gore <hello@dylangore.ie>"

# Define a working directory
WORKDIR /fyp-api

# Copy source files to container
COPY . .

# Install the required dependencies
RUN npm install

# Expose port 5000
EXPOSE 5000

# Run Nginx
ENTRYPOINT ["npm", "run", "server-prod"]