# 🔧 1단계: 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# 📦 package.json과 lock 파일 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 💻 전체 코드 복사 후 Next.js 빌드
COPY . .
RUN npm run build

# 🚀 2단계: 런타임 이미지
FROM node:18-alpine
WORKDIR /app

# 📦 프로덕션에 필요한 최소 파일만 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm install --omit=dev

# ✅ 실행에 필요한 핵심 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.env.production ./          
COPY --from=builder /app/src ./src                   

# ✅ 환경 설정
ENV NODE_ENV=production
EXPOSE 3000

# ✅ 실행 명령
CMD ["npm", "run", "start"]