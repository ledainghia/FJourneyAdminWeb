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
                withCredentials([
                    string(credentialsId: 'NEXT_PUBLIC_API_KEY', variable: 'NEXT_PUBLIC_API_KEY'),
                    string(credentialsId: 'NEXT_PUBLIC_MEASUREMENT_ID', variable: 'NEXT_PUBLIC_MEASUREMENT_ID'),
                    string(credentialsId: 'NEXT_PUBLIC_APP_ID', variable: 'NEXT_PUBLIC_APP_ID'),
                    string(credentialsId: 'NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY', variable: 'NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY'),
                    string(credentialsId: 'NEXT_PUBLIC_MESSAGING_SENDER_ID', variable: 'NEXT_PUBLIC_MESSAGING_SENDER_ID')
                ]) {
                    echo 'Deploying and cleaning'
                    sh 'docker container stop fjourneyadminweb || echo "this container does not exist"'
                    sh 'echo y | docker system prune'
                    sh '''
                        docker container run -e NEXT_PUBLIC_API_KEY="${NEXT_PUBLIC_API_KEY}" \
                                             -e NEXT_PUBLIC_MEASUREMENT_ID="${NEXT_PUBLIC_MEASUREMENT_ID}" \
                                             -e NEXT_PUBLIC_APP_ID="${NEXT_PUBLIC_APP_ID}" \
                                             -e NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY="${NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY}" \
                                             -e NEXT_PUBLIC_MESSAGING_SENDER_ID="${NEXT_PUBLIC_MESSAGING_SENDER_ID}" \
                                             -d --name fjourneyadminweb -p 3000:3000 chalsfptu/fjourneyadminweb
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
