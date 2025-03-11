# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Set environment variable for port (Cloud Run requires this)
ENV PORT=8080

# Start the app
CMD ["npm", "start"]