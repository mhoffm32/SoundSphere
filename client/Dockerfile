# Use official Node.js image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Expose the port React uses by default
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
