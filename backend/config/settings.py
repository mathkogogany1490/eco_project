from pathlib import Path
import environ
import os
from datetime import timedelta


# ==================================================
# Base Directory
# ==================================================
BASE_DIR = Path(__file__).resolve().parent.parent


# ==================================================
# .env 로드
# ==================================================
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))


# ==================================================
# 기본 설정
# ==================================================
SECRET_KEY = env("SECRET_KEY")

APP_ENV = env("APP_ENV", default="development")
APP_NAME = env("APP_NAME", default="Eco-Scale API")

DEBUG = APP_ENV != "production"

if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])


# ==================================================
# Application
# ==================================================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_extensions",

    # Local
    "eco_app",
]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "config.wsgi.application"


# ==================================================
# Database (PostgreSQL)
# ==================================================
if not env("DATABASE_URL", default=None):
    raise RuntimeError("DATABASE_URL is not set in .env")

DATABASES = {
    "default": env.db()
}

DATABASES["default"]["CONN_MAX_AGE"] = 60


# ==================================================
# Password validation
# ==================================================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ==================================================
# Internationalization
# ==================================================
LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"

USE_I18N = True
USE_TZ = True


# ==================================================
# Static / Media
# ==================================================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ==================================================
# Default PK Field
# ==================================================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ==================================================
# Custom User
# ==================================================
AUTH_USER_MODEL = "eco_app.User"


# ==================================================
# CORS
# ==================================================
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost",
        "http://127.0.0.1",
    ]

CORS_ALLOW_CREDENTIALS = True


# ==================================================
# CSRF
# ==================================================
CSRF_TRUSTED_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
]


# ==================================================
# REST Framework
# ==================================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}


# ==================================================
# JWT 설정
# ==================================================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env.int("ACCESS_TOKEN_EXPIRE_MINUTES", default=60)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ==================================================
# Custom ENV Settings
# ==================================================
SYSTEM_API_KEY = env("SYSTEM_API_KEY", default=None)


# ==================================================
# Proxy (Nginx)
# ==================================================
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# ==================================================
# Production 보안 설정
# ==================================================
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_SSL_REDIRECT = True


# ==================================================
# Logging (Docker 환경)
# ==================================================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}