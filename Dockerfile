# Step 1: Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build


# Step 2: Production stage
FROM node:18-slim AS runner

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set env
ENV NODE_ENV=production
ENV PORT=3000

# Expose the correct port
EXPOSE 3000

# Start Next.js server
CMD ["npx", "next", "start", "-p", "3000"]
