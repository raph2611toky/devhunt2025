# apps/user/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from helpers.ia_navigation import generer_texte_stream_websocket

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Connexion établie avec succès !'
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')

        async def send_chunk(chunk):
            await self.send(text_data=json.dumps({
                'message': chunk
            }))

        await generer_texte_stream_websocket(
            texte_entree=message,
            modele="mistral",
            send_callback=send_chunk
        )