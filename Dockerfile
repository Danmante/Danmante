FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run typecheck
EXPOSE 4000
CMD ["npm", "run", "api"]
