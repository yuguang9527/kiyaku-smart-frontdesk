# 🚀 部署指南 - Deployment Guide

将 Kiyaku Smart Frontdesk 部署到生产环境的完整指南。

## 🏗️ 部署架构

- **前端**: Vercel (免费)
- **后端**: Railway (免费额度)
- **数据库**: Railway MySQL (免费额度)

## 📋 部署前准备

### 1. 获取必要的API密钥

- **Groq API Key**: https://console.groq.com/
- **Twilio Account**: https://www.twilio.com/console (可选，用于电话功能)

### 2. 注册部署平台账号

- **Vercel**: https://vercel.com/
- **Railway**: https://railway.app/

## 🗄️ 第一步：部署数据库

### Railway MySQL 部署

1. 登录 [Railway](https://railway.app/)
2. 点击 "New Project" → "Deploy MySQL"
3. 等待部署完成
4. 在 "Variables" 中找到数据库连接信息
5. 复制 `DATABASE_URL`

## 🔧 第二步：部署后端

### Railway 后端部署

1. 在 Railway 点击 "New Project" → "Deploy from GitHub repo"
2. 选择你的 `kiyaku-smart-frontdesk` 仓库
3. 选择部署 `backend` 目录
4. 配置环境变量：

```env
DATABASE_URL=mysql://root:password@host:port/railway
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secure-jwt-secret-min-32-characters
GROQ_API_KEY=your-groq-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
FRONTEND_URL=https://your-app.vercel.app
```

5. 点击 "Deploy"
6. 部署完成后，复制后端URL（例如：`https://your-backend.railway.app`）

## 🌐 第三步：部署前端

### Vercel 前端部署

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "New Project"
3. Import 你的 GitHub 仓库 `kiyaku-smart-frontdesk`
4. 选择 Root Directory（根目录）
5. 配置环境变量：

```env
VITE_API_URL=https://your-backend.railway.app/api
```

6. 点击 "Deploy"
7. 部署完成后，获取前端URL（例如：`https://your-app.vercel.app`）

## 🔄 第四步：更新后端CORS设置

1. 回到 Railway 后端项目
2. 更新环境变量 `FRONTEND_URL` 为你的 Vercel URL
3. 重新部署后端

## 🗃️ 第五步：初始化数据库

后端第一次部署时会自动运行：
- `prisma migrate deploy` - 应用数据库迁移
- `prisma db seed` - 添加初始数据

如果需要手动操作：

1. 在 Railway 后端项目中打开 "Console"
2. 运行命令：
```bash
npm run db:deploy
```

## ✅ 验证部署

### 1. 检查后端健康状态
访问：`https://your-backend.railway.app/api/health`

应该返回：
```json
{
  "status": "OK",
  "timestamp": "2024-12-14T..."
}
```

### 2. 检查前端
访问：`https://your-app.vercel.app`

### 3. 测试登录
使用默认管理员账号：
- **邮箱**: admin@kiyaku.com
- **密码**: admin123

## 🔧 常见问题解决

### 数据库连接问题
- 确保 `DATABASE_URL` 格式正确
- 检查数据库是否已启动

### CORS 错误
- 确保后端 `FRONTEND_URL` 设置正确
- 检查前端 `VITE_API_URL` 指向正确的后端地址

### 构建失败
- 检查所有依赖是否安装
- 确保 TypeScript 类型无错误

## 🔒 安全建议

1. **JWT_SECRET**: 使用强随机字符串（至少32字符）
2. **数据库密码**: 使用复杂密码
3. **API密钥**: 不要在代码中硬编码，使用环境变量
4. **HTTPS**: 生产环境强制使用HTTPS

## 📈 监控和日志

### Railway 监控
- 在 Railway Dashboard 查看应用状态
- 检查日志文件排查问题

### Vercel 监控  
- 在 Vercel Dashboard 查看部署状态
- 查看构建日志

## 🔄 持续部署

### 自动部署设置
- **Vercel**: 推送到 `main` 分支自动部署前端
- **Railway**: 推送到 `main` 分支自动部署后端

### 手动部署
- **Vercel**: 在 Dashboard 点击 "Redeploy"
- **Railway**: 在 Dashboard 点击 "Deploy"

## 💡 优化建议

1. **缓存**: 配置适当的缓存策略
2. **CDN**: Vercel 自动提供全球CDN
3. **数据库**: 考虑升级到更高性能的数据库套餐
4. **监控**: 添加应用性能监控工具

## 📞 支持

如果部署过程中遇到问题：
1. 检查各平台的文档
2. 查看错误日志
3. 在 GitHub 创建 Issue

祝部署顺利！🎉