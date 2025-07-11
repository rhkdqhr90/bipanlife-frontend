# 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 실행 단계
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

# npx를 통해 serve 실행 (글로벌 설치 없이 실행 가능)
EXPOSE 3000
CMD ["npx", "serve", "-s", "out", "-l", "3000"]