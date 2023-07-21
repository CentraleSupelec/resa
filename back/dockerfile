# Building image
FROM node:14

RUN npm install pm2 -g
# Create app directory
WORKDIR /usr/src/app
# Copy defintion
COPY . .
# Install dependencies
RUN npm install --pure-lockfile
EXPOSE 3001
CMD ["pm2", "start", "/usr/src/app/pm2/ecosystem.config.js","--attach"]
