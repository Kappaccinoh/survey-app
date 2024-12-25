# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /backend

# Install system dependencies including PostgreSQL client
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create and set permissions for media and static directories
RUN mkdir -p /app/media /app/static \
    && chmod -R 755 /app/media /app/static

# Expose port
EXPOSE 8000

# Start script for handling migrations and server startup
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"] 