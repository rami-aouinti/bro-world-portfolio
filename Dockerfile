# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
RUN apk add --no-cache libc6-compat openssl
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
ENV DATABASE_URL=${DATABASE_URL}
ENV NITRO_PRESET=docker
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV PORT=3000
COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
