# Dockerfile

# Step 1: Use Bun base image (bun is this project's runner — see AGENT.md)
FROM oven/bun:1 AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and bun.lock
COPY package.json bun.lock ./

# Step 4: Install dependencies.
RUN bun install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN bun run build

# Step 7: Use a lightweight web server for the production build
FROM nginx:alpine AS production

# Step 8: Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
