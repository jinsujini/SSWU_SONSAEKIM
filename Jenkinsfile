pipeline {
    agent any

    environment {
        DOCKER_LOGIN = credentials('dockerhub-login')
        CREDENTIALS_ID = '2b8ffc9d-989a-47d3-a15f-1d34486232b0'
        PROJECT_ID = 'dulcet-clock-477102-m7'
        CLUSTER_NAME = 'kube'
        LOCATION = 'us-central1-a'
    }

    stages {
        stage('CI Gate') { //feature 브랜치에 푸시했을때는 CI없고, PR 만들었을때만 생기게 하려고 추가했어요
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                echo "CI allowed"
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                sh """
                    echo "$DOCKER_LOGIN_PSW" | docker login -u "$DOCKER_LOGIN_USR" --password-stdin
                """
            }
        }

        stage('Build Images') {
            steps {
                sh "BUILD_NUMBER=${env.BUILD_NUMBER} docker compose build"
            }
        }

        stage('Push Images') {
            steps {
                sh "BUILD_NUMBER=${env.BUILD_NUMBER} docker compose push"
            }
        }
        stage('Inline Secret into Deployment') {
            steps {
                withCredentials([file(credentialsId: 'k8s-secret-file', variable: 'SECRET_FILE')]) {
                    sh """
                        echo 'Appending secret to deployment.yaml'

                        echo "\\n---" >> k8s/deployment.yaml

                        cat "$SECRET_FILE" >> k8s/deployment.yaml
                    """
                }
            }
        }
        stage('Render Deployment') {
            steps {
                sh """
                    sed -i "s#sswu_sonsaekim-flask:.*#sswu_sonsaekim-flask:${BUILD_NUMBER}#g" k8s/deployment.yaml
                    sed -i "s#sswu_sonsaekim-node:.*#sswu_sonsaekim-node:${BUILD_NUMBER}#g" k8s/deployment.yaml
                """
            }
        }

        stage('Deploy to GKE') {
            when {
                branch 'main'
            }
            steps {
                step([
                    $class: 'KubernetesEngineBuilder',
                    projectId: env.PROJECT_ID,
                    clusterName: env.CLUSTER_NAME,
                    location: env.LOCATION,

                    manifestPattern: 'k8s/deployment.yaml',

                    credentialsId: env.CREDENTIALS_ID,
                    verifyDeployments: true
                ])
            }
        }
    }

    post {
        success { echo "SUCCESS" }
        failure { echo "FAILED" }
    }
}



