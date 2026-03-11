FROM node:20-alpine
# Receive the argument from docker-compose
ARG VITE_API_URL
# Set it as an environment variable for the build process
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Now Vite will 'see' the variable during the build/dev process
CMD ["npm", "run", "dev", "--", "--host"]