from django.urls import path
from mycall import consumers

websocket_urlpatterns = [
    path("call/", consumers.WebRTCConsumer.as_asgi(), name="call"),
    path("chat/", consumers.ChatConsumer.as_asgi(), name="chat"),
]
