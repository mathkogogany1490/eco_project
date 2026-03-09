docker compose up -d --build

docker compose down --rmi all -v


docker ps


docker compose logs frontend
docker compose logs backend
docker compose logs nginx



docker build -t my-jenkins .

docker rm -f jenkins

docker run -d `
  --name jenkins `
  --user root `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  my-jenkins


docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword

docker exec -it jenkins bash
docker version
docker compose version
chown root:docker /var/run/docker.sock
chmod 660 /var/run/docker.sock
ls -l /var/run/docker.sock

git add .
git commit -m "emp_jenkins up2"