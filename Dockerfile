# Use Bitnami Node 22 image as base
FROM bitnami/node:22

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the application source code
COPY . .

# Build the Angular application for production
RUN npm run build

# The built files will be available in /app/dist/claucia-web
# This can be copied in your nginx Dockerfile using:
# COPY --from=builder /app/dist/claucia-web /usr/share/nginx/html 