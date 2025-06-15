# 🔐 Lockbox – Secure Password Manager

A secure and simple Django web application that lets you **store all your passwords in one place**, protected by a **single master password**. Lockbox ensures that your sensitive data is securely encrypted and only accessible to you.

<p align="left">
  <img src="lockbox-logo.png" alt="Lockbox Logo" width="120"/><br>
  <a href="https://lockbox-zkgy.onrender.com/">🔗 Visit Live Deployment</a>
</p>


## 🚀 Features

- 🔑 **Master Password System** – Only remember one password to access all your saved credentials.
- 🔐 **Secure Storage** – Passwords are encrypted and stored securely in a PostgreSQL database.
- 📦 **RESTful API** – Built using Django REST Framework.
- 🌍 **CORS Support** – Frontend and API can run on different domains securely.
- 📁 **Static Files Served with Whitenoise** – For fast and easy static file handling in production.
- 🛡️ **Production-Ready Configuration** – Optimised for deployment on Render.
- 💾 **PostgreSQL Database** – Reliable and scalable relational database.
- ⚙️ **Django 5.2.2** – Built with the latest version of Django.


## 🗂️ Project Structure

```
lockbox/
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


## ⚙️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/ishikasingh777/lockbox.git
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


## 📄 License

MIT License

