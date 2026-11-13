# Use the official Node.js image as the base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .
RUN npx prisma generate
# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application and when we try ci/cd we will run prisma generate and prisma migrate deploy before starting the application
CMD ["sh", "-c", "npx prisma db push && npm run start"]