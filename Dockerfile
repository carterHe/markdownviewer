# 使用官方 Node.js 作为基础镜像
FROM node:18-alpine

# 创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器中
COPY package*.json ./

# 安装应用的依赖
RUN npm install --frozen-lockfile

# 复制整个项目到容器
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 运行 Next.js 应用
CMD ["npm", "start"]
