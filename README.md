# Chinese Character Classification System

A robust full-stack solution for real-time handwritten Chinese character recognition using deep learning. This system leverages a DenseNet121 architecture to classify images of 200 distinct characters with high precision.

## System Architecture

The project is architected as a decoupled system to ensure modularity and scalability:

- **Client Layer:** A React.js single-page application (SPA) focused on user experience and real-time visualization of model inference results.
- **Service Layer:** A Flask-based RESTful API serving as the inference engine, handling image preprocessing and deep learning model execution.
- **Inference Model:** A pre-trained DenseNet121 model optimized for 64x64 RGB input, facilitating high-density feature extraction with reduced parameter overhead.

## Core Technical Stack

### Backend (Deep Learning API)

- **Engine:** Python / Flask
- **Framework:** TensorFlow & Keras
- **Image Processing:** PIL (Pillow) & NumPy
- **Production Server:** Gunicorn (WSGI)
- **Features:** CORS-enabled, standardized image normalization, and robust error management.

### Frontend (User Interface)

- **Framework:** React.js (v18+)
- **HTTP Client:** Axios
- **State Management:** React Functional Hooks
- **Design:** Custom CSS with a focus on intuitive workflow and responsive image rendering.

## Repository Structure

```text
.
├── backend/               # Python/Flask service and model logic
│   └── app.py             # Main API entry point and model loading
├── frontend/              # React.js application
│   ├── public/            # Static assets
│   └── src/               # Component and application logic
└── README.md              # System documentation
```

## Deployment Guide

### Prerequisites

- Python 3.8+
- Node.js 14+ / npm
- Pre-trained weights: `optimal_densenet.keras` (must be placed in `backend/`)

### Backend Setup

1. Initialize the environment and install dependencies:
   ```bash
   cd backend
   pip install flask tensorflow pillow numpy flask-cors gunicorn
   ```
2. Execute the production server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5050 app:app
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch the development server:
   ```bash
   npm install react react-dom react-scripts axios web-vitals
   ```
   The application defaults to `http://localhost:3000`.

## Model Methodology

The underlying classification model utilizes the **DenseNet121** architecture, which minimizes the vanishing gradient problem and strengthens feature propagation through dense connectivity patterns. This makes it particularly effective for the complex structural nuances of handwritten Chinese characters.

The model was trained on the **HCCR dataset**. Technical specifics regarding the training pipeline, hyperparameter optimization, and data augmentation can be found in the primary research repository: [https://github.com/Crispy2chickens/hccr](https://github.com/Crispy2chickens/hccr).
