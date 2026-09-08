#!/bin/bash
cd "$(dirname "$0")"

# 构建
pnpm build

# 打包部署文件
tar -czf deploy.tar.gz \
  .next/standalone \
  .next/static \
  public \
  .env.prod

echo "已生成 deploy.tar.gz，上传到服务器后解压："
echo "tar -xzf deploy.tar.gz"
echo "node .next/standalone/server.js"
