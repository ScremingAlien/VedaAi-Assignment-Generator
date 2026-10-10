 
FROM node:22-alpine AS base

WORKDIR /app

RUN npm install -g npm@11.13.0



# ==========================================
# PRUNER
# ==========================================

FROM base AS pruner

COPY . .

RUN npx turbo prune backend --docker


# ==========================================
# INSTALLER
# ==========================================

FROM base AS installer

# Copy only dependency manifests first
COPY --from=pruner /app/out/json/ .

RUN npm ci

# Now copy source
COPY --from=pruner /app/out/full/ .

RUN npx turbo build --filter=backend


# ==========================================
# RUNNER
# ==========================================

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer /app/apps/backend/dist ./apps/backend/dist

COPY --from=installer /app/apps/backend/package.json ./apps/backend/package.json

COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "apps/backend/dist/server.js"]