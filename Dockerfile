FROM jenkins/jenkins:lts

USER root

# 기본 패키지
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Docker repository 등록
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg

RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

# Docker CLI 설치 (buildx 포함)
RUN apt-get update && \
    apt-get install -y docker-ce-cli docker-buildx-plugin docker-compose-plugin

# docker 그룹 생성
RUN groupadd docker

# Jenkins user docker 그룹 추가
RUN usermod -aG docker jenkins

USER jenkins