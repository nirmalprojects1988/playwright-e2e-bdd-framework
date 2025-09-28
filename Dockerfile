FROM mcr.microsoft.com/playwright:v1.40.1-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Install browsers
RUN npx playwright install chromium

# Set environment variables
ENV CI=true

# Command to run tests
CMD ["npm", "run", "test:all"]