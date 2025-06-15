# Lockbox Django Web Application

A Django web application using PostgreSQL, ready for deployment on [Render]([https://render.com](https://lockbox-zkgy.onrender.com/)).

<p align="center">
  <img src="lockbox-logo.png" alt="Lockbox" width="120"/>
</p>

---

## 🚀 Features

- Django 5.2.2
- PostgreSQL database
- REST API with Django REST Framework
- CORS support
- Static files served with Whitenoise
- Production-ready settings for Render

---

## 🗂️ Project Structure

```
lc/
├── .gitignore
├── build.sh
├── frontend/
│   └── static/
├── lockbox/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── render.yaml
├── requirements.txt
└── (other Django apps, e.g., core/, api/, etc.)
```

---

## ⚙️ Local Development

### 1. Clone the repository

```bash
git clone [https://github.com/<your-username>/lockbox.git](https://github.com/ishikasingh777/lockbox.git)
cd lockbox
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up PostgreSQL locally

- Ensure PostgreSQL is running.
- Create a database and user matching your `settings.py` (or use environment variables).

### 5. Run migrations and collect static files

```bash
python manage.py migrate
python manage.py collectstatic --no-input
```

### 6. Run the development server

```bash
python manage.py runserver
```

Visit [http://localhost:8000](http://localhost:8000) to view the app.

---

## 📄 License

MIT License

---
