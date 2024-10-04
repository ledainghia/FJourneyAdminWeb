pipeline {
    agent any

    stages {
        stage('Packaging') {
            steps {
                    sh 'docker build --pull --rm -f Dockerfile -t fjourneyadminweb:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh 'docker tag fjourneyadminweb:latest chalsfptu/fjourneyadminweb:latest'
                    sh 'docker push chalsfptu/fjourneyadminweb:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                
                    echo 'Deploying and cleaning'
                    sh 'docker container stop fjourneyadminweb || echo "this container does not exist"'
                    sh 'echo y | docker system prune'
                    sh '''
                        docker container run -d --name fjourneyadminweb -p 3000:3000 chalsfptu/fjourneyadminweb
                    '''
                }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
