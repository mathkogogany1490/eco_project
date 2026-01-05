pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "eco_project"
    }

    stages {

        stage('Inject env files') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV_FILE'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV_FILE')
                ]) {
                    sh '''
                    set -e
                    echo "🔐 Injecting env files..."

                    pwd
                    ls -al

                    mkdir -p backend frontend

                    cp "$BACKEND_ENV_FILE" backend/.env
                    cp "$FRONTEND_ENV_FILE" frontend/.env.local

                    chmod 600 backend/.env frontend/.env.local

                    echo "✅ env files injected"
                    '''
                }
            }
        }

        /* 🔥 이 Stage가 실패 원인을 100% 밝혀냅니다 */
        stage('Debug Compose') {
            steps {
                sh '''
                echo "===== DEBUG START ====="
                pwd
                ls -al

                echo "----- backend -----"
                ls -al backend || true
                cat backend/.env | sed 's/=.*/=***MASKED***/' || true

                echo "----- frontend -----"
                ls -al frontend || true
                cat frontend/.env.local | sed 's/=.*/=***MASKED***/' || true

                echo "----- docker compose config -----"
                docker compose config
                echo "===== DEBUG END ====="
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                sh '''
                set -e
                echo "🚀 Build & Deploy start"

                # 최초 실행 / 컨테이너 없어도 실패하지 않게
                docker compose down || true

                docker compose build --no-cache
                docker compose up -d

                echo "✅ Deploy finished"
                '''
            }
        }
    }
}