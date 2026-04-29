pipeline {

    agent any

    environment {
        COMPOSE_PROJECT_NAME = "eco_project"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                echo "📦 Cloning repository..."
                git branch: 'main',
                    url: 'https://github.com/mathkogogany1490/eco_project.git'
            }
        }

        stage('Clean Docker') {
            steps {
                sh '''
                echo "🐳 Cleaning Docker..."

                docker compose down -v --remove-orphans || true
                docker container prune -f || true
                docker image prune -a -f || true
                docker volume prune -f || true
                docker builder prune -a -f || true

                echo "Docker clean finished"
                '''
            }
        }

        stage('Check Nginx Config') {
            steps {
                sh '''
                echo "Checking nginx directory"

                mkdir -p nginx

                if [ ! -f nginx/nginx.conf ]; then
                    echo "nginx.conf not found"
                    exit 1
                fi

                ls -al nginx

                echo "📄 nginx.conf:"
                cat nginx/nginx.conf
                '''
            }
        }

        stage('Create Env File') {
            steps {
                sh '''
                echo "🔐 Creating .env file..."

cat <<'EOF' > .env
# ==================================================
# Django
# ==================================================
SECRET_KEY="django-insecure-4q_g=fysvdj^vopy0))g($pcur10*6gv50%cy=+5zp@dm2bwqe"
APP_ENV=production
ALLOWED_HOSTS=www.dkr-eco.com,3.36.130.182

# ==================================================
# PostgreSQL (Local)
# ==================================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=eco_project

DATABASE_URL=postgresql://postgres:postgres@db:5432/eco_project

# ==================================================
# JWT
# ==================================================
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ==================================================
# SYSTEM API KEY
# ==================================================
SYSTEM_API_KEY=7c2a1e9b4d6c8f0a2e4d6b8c0e1f3a5

# ==================================================
# CORS
# ==================================================
CORS_ORIGINS=https://www.dkr-eco.com

# ==================================================
# Frontend API
# ==================================================
NEXT_PUBLIC_API_BASE_URL=/api

# ==================================================
# Google Maps
# ==================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCCpChUzPz3LJfUYfQymmxSNKSZVboqZDU
NEXT_PUBLIC_SYSTEM_API_KEY=7c2a1e9b4d6c8f0a2e4d6b8c0e1f3a5

# ==================================================
# EMAIL (SMTP)
# ==================================================
EMAIL_HOST_USER=admin@dkr-eco.com
EMAIL_HOST_PASSWORD=앱비밀번호
EOF

                chmod 600 .env

                echo "📄 .env file:"
                cat .env
                '''
            }
        }

        stage('Debug Environment') {
            steps {
                sh '''
                echo "📂 Workspace files:"
                pwd
                ls -al

                echo "🐳 Docker version:"
                docker --version
                docker compose version

                echo "📦 Docker Compose Config:"
                docker compose config
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                echo "🏗 Building Docker images..."
                docker compose build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                echo "🚀 Starting deployment..."

                # 🔥 DB 포함 완전 초기화 (중요)
                docker compose down -v
                
                # 불필요한 리소스 정리
                docker container prune -f || true
                docker image prune -a -f || true
                docker volume prune -f || true
                
                # 다시 실행
                docker compose up -d --build
                
                echo "📦 Running containers:"
                docker ps
                '''
            }
        }
        stage('Create Media Folder') {
            steps {
                sh '''
                echo "📁 Creating media folder..."
        
                mkdir -p media/places
                chmod -R 755 media
        
                echo "📂 media folder status:"
                ls -al media
                ls -al media/places
                '''
            }
        }
        stage('Django Migrate') {
            steps {
                sh '''
                echo "🗄 Running Django migrations..."

                # 컨테이너 올라올 시간 확보
                sleep 10
                
                # 🔥 안전하게 migrate
                docker exec eco_backend python manage.py migrate --noinput || \
                docker exec eco_backend python manage.py migrate --fake-initial
                
                echo "Migration complete"
                '''
            }
        }

        stage('Collect Static') {
            steps {
                sh '''
                echo "📦 Collecting static files..."

                docker exec eco_backend python manage.py collectstatic --noinput

                echo "Static collection complete"
                '''
            }
        }

        stage('Fetch Mail') {
            steps {
                sh '''
                echo "📧 Fetching mail..."

                # 컨테이너 안정화 대기
                sleep 5

                docker exec eco_backend python manage.py fetch_mail

                echo "Mail fetch complete"
                '''
            }
        }

        stage('Logs') {
            steps {
                sh '''
                echo "📜 Container logs:"
                docker compose logs --tail=50
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "🏥 Health check..."

                sleep 15

                curl -I http://localhost || true
                '''
            }
        }

    }

    post {

        success {
            echo "✅ Deployment Success"
        }

        failure {
            echo "❌ Deployment Failed"
        }

        always {
            echo "Pipeline finished"
        }

    }

}
