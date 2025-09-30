# Step 1: Build stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Run stage
FROM node:18-slim AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set environment variable
ENV NODE_ENV=production

# Expose port (default for Next.js)
EXPOSE 6000

# Start Next.js server
CMD ["npm", "start"]
