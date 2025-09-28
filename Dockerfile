FROM mcr.microsoft.com/playwright:v1.40.1-focal

# Install Java (required for Allure)
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Allure commandline
RUN curl -o allure-2.24.1.tgz -Ls https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.24.1/allure-commandline-2.24.1.tgz && \
    tar -zxvf allure-2.24.1.tgz -C /opt/ && \
    ln -s /opt/allure-2.24.1/bin/allure /usr/bin/allure && \
    rm allure-2.24.1.tgz

# Copy project files
COPY . .

# Create reports directory with proper permissions
RUN mkdir -p reports/allure-results reports/allure-report && \
    chmod -R 777 reports

# Install browsers
RUN npx playwright install chromium

# Set environment variables
ENV CI=true
ENV ALLURE_NO_ANALYTICS=1

# Command to run tests
CMD ["npm", "run", "test:all"]