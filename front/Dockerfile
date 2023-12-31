# Building image
FROM node:14 AS development

# Create app directory
WORKDIR /app
ARG REACT_APP_CAS_LOGIN_URL="https://cas.example.fr/login"
ARG REACT_APP_CAS_LOGOUT_URL="https://cas.example.fr/logout"
ARG REACT_APP_CAS_LOGIN_SERVICE="/loginAccept/"
ARG REACT_APP_CAS_LOGOUT_SERVICE="/"
ARG REACT_APP_BACK_URL="/api"
ARG REACT_APP_IMAGES_BASE_URL="/roomImages/"

# If you want to use two different CAS
ARG REACT_APP_ALT_CAS_LOGIN_URL="https://altCas.example.fr/login"
ARG REACT_APP_ALT_CAS_LOGOUT_URL="https://altCas.example.fr/logout"
ARG REACT_APP_ALT_CAS_LOGIN_SERVICE="/loginAccept/"
ARG REACT_APP_ALT_CAS_LOGOUT_SERVICE="/"
ARG REACT_APP_ALT_BACK_URL="/api"

# Copy app definition
COPY . .

# Install dependencies
RUN npm install 

# Build 
RUN npm run build

# Nginx server
FROM nginx:stable-alpine AS serve
COPY --from=development /app/build /var/www/build
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
