FROM node:lts-alpine AS build  
WORKDIR /app  
COPY package.json package-lock.json ./  
RUN npm ci  
COPY . .  
RUN npm run build  
  
FROM nginx:stable-alpine  
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf  
EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]
