pipeline {  
    agent any

    environment {
            timestamp = "${System.currentTimeMillis() / 1000L}"
        }

    stages {

        stage('Prepare') {
            steps {
                script {
                    def oldImageId = sh(script: "docker images fe_wqproject:latest -q", returnStdout: true).trim()
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
                    cp /.env .env
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
                sh 'docker build -t fe_wqproject:${timestamp} .'
            }  
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Check if the container is already running
                    def isRunning = sh(script: "docker ps -q -f name=fe_wqproject", returnStdout: true).trim()

                    if (isRunning) {
                        sh "docker rm -f fe_wqproject"
                    }

                    // Run the new container
                    try {
                        sh """
                        docker run \
                          --name=fe_wqproject \
                          -p 82:80 \
                          -v /home/docker_projects/wqproejct-fe/volumes/gen:/gen \
                          --restart unless-stopped \
                          --network=application \
                          -e TZ=Asia/Seoul \
                          -d \
                          fe_wqproject:${timestamp}
                        """
                    } catch (Exception e) {
                        // If the container failed to run, remove it and the image
                        isRunning = sh(script: "docker ps -q -f name=fe_wqproject", returnStdout: true).trim()

                        if (isRunning) {
                            sh "docker rm -f fe_wqproject"
                        }

                        def imageExists = sh(script: "docker images -q fe_wqproject:${timestamp}", returnStdout: true).trim()

                        if (imageExists) {
                            sh "docker rmi fe_wqproject:${timestamp}"
                        }

                        error("Failed to run the Docker container.")
                    }

                    // If there's an existing 'latest' image, remove it
                    def latestExists = sh(script: "docker images -q fe_wqproject:latest", returnStdout: true).trim()

                    if (latestExists) {
                        sh "docker rmi fe_wqproject:latest"

                        if(!oldImageId.isEmpty()) {
                            sh "docker rmi ${oldImageId}"
                        }
                    }

                    // Tag the new image as 'latest'
                    sh "docker tag fe_wqproject:${env.timestamp} fe_wqproject:latest"
                }
            }
        }
    }  
}