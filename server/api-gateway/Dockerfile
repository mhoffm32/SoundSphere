# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose the port your Express app uses (usually 3000 or check your code)
EXPOSE 4000

# Run the dev script
CMD ["nodemon", "gateway.js"]
