FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
# Install all dependencies (including devDependencies like tsx, typescript)
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]