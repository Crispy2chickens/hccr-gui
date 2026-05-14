# Chinese Character Recognition

A full-stack web app for handwritten Chinese character recognition. Draw or upload a character to get the top-5 predictions from a DenseNet121 model trained on 200 characters from the HCCR dataset.

## System Architecture

- **Frontend:** React 19 SPA deployed on Vercel — supports freehand drawing and image upload, polls the backend for model readiness, and displays top-5 predictions with confidence bars.
- **Backend:** Flask REST API running on Gunicorn — loads a pre-trained ONNX model at startup and serves predictions via `/predict`.
- **Model:** DenseNet121 trained on the [HCCR dataset](https://github.com/Crispy2chickens/hccr), served via `onnxruntime`. The model file is not committed; it is downloaded at runtime from `MODEL_URL`.

## Repository Structure

```text
.
├── backend/
│   ├── app.py                # Flask API (predict, status endpoints)
│   ├── gunicorn.conf.py      # Gunicorn config (1 worker, post_fork model preload)
│   └── requirements.txt
└── frontend/
    ├── public/
    └── src/
        ├── App.js
        ├── DrawCanvas.js
        └── FileUpload.js
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/status` | Returns `{ ready: bool, error: string\|null }` — used by the frontend to poll model load state |
| `POST` | `/predict` | Accepts `multipart/form-data` with a `file` field; returns top-5 `{ character, confidence }` predictions |

## Local Setup

### Prerequisites

- Python 3.8+
- Node.js 18+ / npm
- `MODEL_URL` environment variable pointing to a hosted copy of `model.onnx`

### Backend

```bash
cd backend
pip install -r requirements.txt
MODEL_URL=<your-model-url> gunicorn --config gunicorn.conf.py -b 0.0.0.0:5050 app:app
```

The model loads asynchronously after the worker starts. The `/status` endpoint returns `{ ready: false }` until loading completes.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend defaults to `http://localhost:5050` for the API. Override with the `REACT_APP_API_URL` environment variable if needed.

## Deployment

The frontend is deployed on Vercel. Set `REACT_APP_API_URL` in the Vercel project environment variables to point at the hosted backend.

The backend can be deployed on any platform that supports Python and Gunicorn. Set `MODEL_URL` to a hosted copy of the model file — the server will download it on first start if not already present.

## Supported Characters (200)

墨 竟 章 隐 隔 隘 隙 障 隧 隶 难 雀 雁 雄 雅 集 雇 雌 雍 雏 雕 雨 雪 零 雷 雹 雾 需 霄 震 霉 霍 霓 霖 霜 霞 露 霸 霹 青 靖 静 靛 非 靠 靡 面 革 靳 靴 靶 鞋 鞍 鞘 鞠 鞭 韦 韧 韩 韭 音 韵 韶 页 顶 顷 项 顺 须 顽 顾 顿 颁 颂 预 颅 领 颇 颈 颊 颐 频 颓 颖 颗 题 颜 额 颠 颤 颧 风 飘 飞 食 餐 饥 饭 饮 饯 饰 饱 饲 饵 饶 饺 饼 饿 馁 馅 馆 馈 馋 馏 馒 首 香 马 驭 驮 驯 驰 驱 驳 驴 驶 驹 驻 驼 驾 骂 骄 骆 骇 骋 验 骏 骑 骗 骚 骡 骤 骨 骸 髓 高 鬃 鬼 魁 魂 魄 魏 魔 鱼 鲁 鲍 鲜 鲤 鲸 鳃 鳖 鳞 鸟 鸡 鸣 鸥 鸦 鸭 鸯 鸳 鸵 鸽 鸿 鹃 鹅 鹊 鹏 鹤 鹰 鹿 麓 麦 麻 黄 黍 黎 黑 黔 默 鼎 鼓 鼠 鼻 齐 齿 龄 龋 龙 龚 龟
