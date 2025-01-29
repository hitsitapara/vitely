# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the backend code
COPY . .

# Expose port and start the server
EXPOSE 8000
CMD ["npm", "start"]
