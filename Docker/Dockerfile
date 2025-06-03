# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY ../package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. Build the TypeScript code
RUN npm run build

# 6. Expose desired port (e.g., 5000)
EXPOSE ${PORT}

# 7. Run the server
CMD ["npm", "start"]
