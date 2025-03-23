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
        print(f"Déconnexion avec code : {close_code}")

    async def receive(self, text_data):
        print(f"Reçu brut : {text_data}")
        try:
            text_data_json = json.loads(text_data.strip())
            message = text_data_json.get('message', '')
        except json.JSONDecodeError:
            message = text_data.strip() if text_data else ''
            print(f"Texte brut détecté : {message}")

        if not message:
            await self.send(text_data=json.dumps({
                'message': 'Message vide reçu'
            }))
            return

        async def send_chunk(chunk):
            await self.send(text_data=json.dumps({
                'message': chunk
            }))

        await generer_texte_stream_websocket(
            texte_entree=message,
            modele="mistral",
            send_callback=send_chunk
        )