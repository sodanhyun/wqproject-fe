pipeline {  
    agent any

    environment {
            timestamp = "${System.currentTimeMillis() / 1000L}"
        }

    stages {

        stage('Prepare') {
            steps {
                script {
                    // Get the ID of the sbb:latest image
                    def oldImageId = sh(script: "docker images FE_wqproject:latest -q", returnStdout: true).trim()
                    env.oldImageId = oldImageId
                }

                git branch: 'main',
                    url: 'https://github.com/sodanhyun/wqproject-fe'
            }

            post {
                success {
                    sh 'echo "Successfully Cloned Repository"'
                }
                failure {
                    sh 'echo "Fail Cloned Repository"'
                }
            }
        }

        stage('Build') {  
            steps {
                dir('.') {
                    sh """
                    npm install
                    """
                }

                dir('.') {
                    sh """
                    CI=false npm run build
                    """
                }
            }
            post {
                success {
                    sh 'echo "Successfully Build Test"'
                }
                 failure {
                    sh 'echo "Fail Build Test"'
                }
            }
        }  
        stage('Docker Build') {  
            steps {  
                sh 'docker build -t shop-react-demo:${timestamp} .'
            }  
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Check if the container is already running
                    def isRunning = sh(script: "docker ps -q -f name=FE_wqproject", returnStdout: true).trim()

                    if (isRunning) {
                        sh "docker rm -f FE_wqproject"
                    }

                    // Run the new container
                    try {
                        sh """
                        docker run \
                          --name=FE_wqproject \
                          -p 82:80 \
                          -v /docker_projects/wqproejct-fe/volumes/gen:/gen \
                          --restart unless-stopped \
                          --network application \
                          -e TZ=Asia/Seoul \
                          -d \
                          FE_wqproject:${timestamp}
                        """
                    } catch (Exception e) {
                        // If the container failed to run, remove it and the image
                        isRunning = sh(script: "docker ps -q -f name=FE_wqproject", returnStdout: true).trim()

                        if (isRunning) {
                            sh "docker rm -f FE_wqproject"
                        }

                        def imageExists = sh(script: "docker images -q FE_wqproject:${timestamp}", returnStdout: true).trim()

                        if (imageExists) {
                            sh "docker rmi FE_wqproject:${timestamp}"
                        }

                        error("Failed to run the Docker container.")
                    }

                    // If there's an existing 'latest' image, remove it
                    def latestExists = sh(script: "docker images -q FE_wqproject:latest", returnStdout: true).trim()

                    if (latestExists) {
                        sh "docker rmi FE_wqproject:latest"

                        if(!oldImageId.isEmpty()) {
                            sh "docker rmi ${oldImageId}"
                        }
                    }

                    // Tag the new image as 'latest'
                    sh "docker tag FE_wqproject:${env.timestamp} FE_wqproject:latest"
                }
            }
        }
    }  
}