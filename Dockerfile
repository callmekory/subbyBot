FROM node:latest

# Update system
RUN apt update && apt install git -y
RUN npm install -g pm2 tsc yarn
RUN curl https://rclone.org/install.sh | bash

# Create the directory
RUN mkdir -p /app
WORKDIR /app

# Copy and Install bot
COPY . /app
RUN yarn install
RUN tsc

# Expose ports
EXPOSE 5700

# Expose volume
VOLUME /app/build/config

# Start
CMD ["pm2-runtime", "/build/index.js"]