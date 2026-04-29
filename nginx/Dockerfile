FROM nginx:1.27-alpine

# 🔥 기본 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 🔥 내가 만든 설정 적용
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
