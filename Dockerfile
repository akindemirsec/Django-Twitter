# Backend Dockerfile
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY twitter_clone /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000 and start the server
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
