import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.user.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

# import os
# import socketio
# from django.core.asgi import get_asgi_application
# from helpers.ia_navigation import generer_texte_stream_websocket

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
# django_asgi_app = get_asgi_application()

# sio = socketio.AsyncServer(async_mode='asgi')
# app = socketio.ASGIApp(sio, django_asgi_app)

# @sio.event
# async def connect(sid, environ):
#     print(f"Client connecté : {sid}")
#     await sio.emit('message', {'message': 'Connexion établie avec succès !'}, to=sid)

# @sio.event
# async def disconnect(sid):
#     print(f"Client déconnecté : {sid}")

# @sio.event
# async def message(sid, data):
#     message = data.get('message', '')
#     print(f"Message reçu de {sid} : {message}")

#     async def send_chunk(chunk):
#         await sio.emit('message', {'message': chunk}, to=sid)

#     await generer_texte_stream_websocket(
#         texte_entree=message,
#         modele="mistral",
#         send_callback=send_chunk
#     )

# application = app