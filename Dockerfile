# Etapa 1: Compilar la aplicación
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/inventario-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
