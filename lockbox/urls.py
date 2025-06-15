from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from api import views as api_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('register/', api_views.register_view, name='register'),
    path('', TemplateView.as_view(template_name='index.html')),
]

# Serve static files in development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0]) 