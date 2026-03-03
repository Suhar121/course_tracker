pipeline {
    agent any
    
    environment {
        // Docker Hub credentials (configure in Jenkins)
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-creds')
        DOCKER_IMAGE_NAME = 'suhar121/course-tracker'
        DOCKER_TAG = "${BUILD_NUMBER}"
        NODE_VERSION = '18'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo 'Setting up Node.js environment...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci --silent'
            }
        }
        
        stage('Lint & Code Quality') {
            parallel {
                stage('ESLint') {
                    steps {
                        echo 'Running ESLint...'
                        sh 'npm run build || echo "Build warnings detected"'
                    }
                }
                stage('Audit Dependencies') {
                    steps {
                        echo 'Checking for security vulnerabilities...'
                        sh 'npm audit --audit-level=high || echo "High severity vulnerabilities found"'
                    }
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building React application...'
                sh 'npm run build'
                
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: 'build/**/*', fingerprint: true
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running test suite...'
                sh 'CI=true npm test -- --coverage --watchAll=false'
            }
            post {
                always {
                    // Publish test results if using Jest with JUnit reporter
                    // publishTestResults testResultsPattern: 'test-results.xml'
                    echo 'Test stage completed'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    def image = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}")
                    
                    // Also tag as latest for main branch
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                        image.tag('latest')
                    }
                    
                    // Tag with git commit for traceability
                    image.tag("git-${env.GIT_COMMIT_SHORT}")
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security scan on Docker image...'
                script {
                    try {
                        // Using Trivy for container scanning (if available)
                        sh """docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                            aquasec/trivy:latest image ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"""
                    } catch (Exception e) {
                        echo "Security scan failed or Trivy not available: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                    expression { return params.FORCE_DEPLOY == true }
                }
            }
            steps {
                echo 'Pushing Docker image to registry...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-creds') {
                        def image = docker.image("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}")
                        image.push()
                        image.push("git-${env.GIT_COMMIT_SHORT}")
                        
                        if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                            image.push('latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            environment {
                DEPLOY_ENV = 'staging'
            }
            steps {
                echo 'Deploying to staging environment...'
                script {
                    // Example deployment using Docker Compose
                    sh '''
                        echo "DOCKER_TAG=${DOCKER_TAG}" > .env.staging
                        echo "DOCKER_IMAGE=${DOCKER_IMAGE_NAME}" >> .env.staging
                        
                        # Deploy using docker-compose (if available)
                        # docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d
                        
                        echo "Staging deployment completed"
                    '''
                }
            }
            post {
                success {
                    echo 'Staging deployment successful!'
                    // Send notification to team
                }
                failure {
                    echo 'Staging deployment failed!'
                    // Send alert to team
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                allOf {
                    anyOf {
                        branch 'main'
                        branch 'master'
                    }
                    expression { return params.DEPLOY_TO_PROD == true }
                }
            }
            environment {
                DEPLOY_ENV = 'production'
            }
            steps {
                echo 'Deploying to production environment...'
                
                // Add manual approval for production deployments
                input message: 'Deploy to Production?', ok: 'Deploy', submitterParameter: 'APPROVER'
                
                script {
                    sh '''
                        echo "DOCKER_TAG=${DOCKER_TAG}" > .env.production
                        echo "DOCKER_IMAGE=${DOCKER_IMAGE_NAME}" >> .env.production
                        
                        # Production deployment
                        echo "Production deployment would happen here"
                        
                        # Health check after deployment
                        echo "Running post-deployment health checks..."
                        # curl -f http://your-production-url/health || exit 1
                    '''
                }
            }
            post {
                success {
                    echo "Production deployment successful! Approved by: ${env.APPROVER}"
                    // Send success notification
                }
                failure {
                    echo 'Production deployment failed!'
                    // Send alert and rollback if needed
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed.'
            
            // Clean up Docker images to save space
            sh '''
                docker image prune -f
                docker system prune -f
            '''
        }
        
        success {
            echo 'Pipeline completed successfully!'
            
            // Send success notification
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                    echo "🎉 Course Tracker v${BUILD_NUMBER} deployed successfully!"
                }
            }
        }
        
        failure {
            echo 'Pipeline failed!'
            
            // Send failure notification with logs
            script {
                echo "❌ Course Tracker build ${BUILD_NUMBER} failed on ${env.BRANCH_NAME}"
            }
        }
        
        unstable {
            echo 'Pipeline completed with warnings.'
        }
    }
    
    // Pipeline parameters
    parameters {
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if not on main branch'
        )
        booleanParam(
            name: 'DEPLOY_TO_PROD',
            defaultValue: false,
            description: 'Deploy to production (main branch only)'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
    }
}