# ===============================
# 1. FRONTEND BUILD STAGE
# ===============================
FROM node:18 AS frontend
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./        
RUN npm install

# Copy frontend source and build
COPY frontend/ ./                     
RUN npm run build

# ===============================
# 2. BACKEND BUILD STAGE
# ===============================
FROM node:18 AS backend
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./         
RUN npm install

# Copy backend source code
COPY backend/ ./                      

# Copy frontend build output into backend's public folder
COPY --from=frontend /app/frontend/dist ./public

# ===============================
# 3. RUN STAGE
# ===============================
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start backend (serves both API & frontend)
CMD ["npm", "start"]
