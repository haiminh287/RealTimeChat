

from django.urls import path, include
from mycall import views,consumers
from rest_framework.routers import DefaultRouter

route = DefaultRouter()
route.register(r'users', views.UserViewSet, basename='user')
urlpatterns = [
    path('', include(route.urls)),
    path('chat/',consumers.ChatConsumer.as_asgi(),name='chat'),
]
