FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the React app source code
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
