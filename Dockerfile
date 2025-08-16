# force rebuild: 2025-08-16
# ===============================
# 1. FRONTEND BUILD STAGE
# ===============================
FROM node:18 AS frontend
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install --production=false

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build   # Vite build -> dist/

# ===============================
# 2. BACKEND BUILD STAGE
# ===============================
FROM node:18 AS backend
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy frontend build output into backend's public folder
COPY --from=frontend /app/frontend/dist ./public

# ===============================
# 3. RUN STAGE
# ===============================
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app/backend

EXPOSE 8080

# Start backend (serves API + frontend build)
CMD ["npm", "start"]
