# Use the official Node.js image as our base image
From node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies in the container
RUN npm install 

# Copy the rest of the application to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 4000

# Command to run the applicaiton
CMD ["npm", "run", "server"]