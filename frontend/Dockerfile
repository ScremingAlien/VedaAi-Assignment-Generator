FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Next.js v16 & React 19 require standard installations 
RUN npm install
COPY . .
# For development context
CMD ["npm", "run", "dev"]