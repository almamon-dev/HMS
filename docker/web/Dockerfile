FROM node:22-alpine

# Compatibility layer required by esbuild/vite native binaries on Alpine
RUN apk add --no-cache gcompat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
