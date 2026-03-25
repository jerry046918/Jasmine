# 试用期管理体验调研

员工问卷调研 Web 应用，基于 Vercel + Vercel KV 部署。

## 项目结构

```
├── survey.html       # 员工填写的问卷页面
├── admin.html        # 管理后台（查看/导出数据）
├── survey-admin.html # 问卷管理后台（备用视图）
├── index.html        # 首页
├── common.css        # 公共样式
├── api/
│   ├── submit.js     # POST /api/submit  提交问卷
│   └── responses.js  # GET  /api/responses 获取数据（需鉴权）
├── package.json
└── vercel.json       # Vercel 路由配置
```

## 本地开发

```bash
npm install
vercel dev
```

访问 `http://localhost:3000`。

## 部署到 Vercel（GitHub 连接方式）

1. 将代码推送到 GitHub 仓库
2. 打开 [vercel.com/new](https://vercel.com/new) → Import Git Repository → 选择该仓库
3. Framework Preset 选 **Other**，直接 Deploy
4. 进入项目 **Storage** → Create Database → KV → Connect to Project
5. 进入 **Settings → Environment Variables**，添加：

| 变量名 | 说明 |
|--------|------|
| `ADMIN_PASSWORD` | 管理后台登录密码（自定义强密码） |

> KV 相关环境变量（`KV_URL` 等）由 Vercel 在绑定 KV 数据库后自动注入，无需手动填写。

## 访问地址

| 页面 | 路径 |
|------|------|
| 问卷填写 | `https://your-project.vercel.app` |
| 管理后台 | `https://your-project.vercel.app/admin` |
| 问卷管理 | `https://your-project.vercel.app/survey-admin` |

## API

```
POST /api/submit
Content-Type: application/json
{ "respondent_name": "张三", "respondent_dept": "研发部", ...answers }

GET /api/responses
Authorization: Bearer <ADMIN_PASSWORD>
```
