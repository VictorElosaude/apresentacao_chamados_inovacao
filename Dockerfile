# Stage 1: Build the application
# Use a lightweight Node.js image to install dependencies and build the project.
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
# This step is cached, so Docker doesn't need to reinstall dependencies
# unless these files change.
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all other project files into the container
COPY . .

# Run the build script defined in your package.json
RUN npm run build

# Stage 2: Serve the static files
# Use a super lightweight Nginx image to serve the static files from the build step.
FROM nginx:alpine

# Copy the built files from the 'builder' stage into the Nginx public directory
# The 'dist' folder is a common output directory for front-end build tools (like Vite, Webpack, etc.).
# If your build output directory is different (e.g., 'build', 'public'), change this path.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# This command starts the Nginx server in the foreground
CMD ["nginx", "-g", "daemon off;"]
