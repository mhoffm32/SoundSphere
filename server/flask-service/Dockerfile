# Use official Python image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements.txt if you have one (best practice)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your Flask app source code
COPY . .

# Expose the port your Flask app runs on (default 5000)
EXPOSE 5002

# Command to run your Flask app
CMD ["python3", "app.py"]
