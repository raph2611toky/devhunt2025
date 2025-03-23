# helpers/ia_navigation.py
import ollama
import lancedb
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import queue
import pyarrow as pa
import asyncio

embedder = SentenceTransformer('all-MiniLM-L6-v2')
texte_queue = queue.Queue()
db = lancedb.connect("./my_vector_db")

MODEL_DEJA_ENTRAINE = "miketrika_mistral_raw"

schema = pa.schema([
    pa.field("vector", pa.list_(pa.float32(), 384)),
    pa.field("text", pa.string())
])
table = db.create_table("documents", schema=schema, exist_ok=True)

def generer_texte(texte_entree, modele="mistral", max_tokens=100, temperature=0.7):
    try:
        reponse = ollama.generate(
            model=modele,
            prompt=texte_entree,
            options={
                "num_predict": max_tokens,
                "temperature": temperature
            }
        )
        return reponse['response'].strip()
    except Exception as e:
        return f"Erreur lors de la génération : {str(e)}"

async def generer_texte_stream_websocket(texte_entree, modele="miketrika_mistral_raw", send_callback=None):
    prompt_francais = f"Réponds en français : {texte_entree}"
    flux = ollama.generate(model=modele, prompt=prompt_francais, stream=True)
    
    texte_accumule = ""
    ponctuations = ".!?,;:"
    
    for morceau in flux:
        contenu = morceau['response']
        texte_accumule += contenu
        
        if contenu and contenu[-1] in ponctuations:
            if send_callback:
                await send_callback(texte_accumule)
            texte_accumule = ""
        
        await asyncio.sleep(0.01)
    if texte_accumule and send_callback:
        await send_callback(texte_accumule)
    return texte_accumule

def ajouter_document(fichier_path):
    with open(fichier_path, 'r', encoding='utf-8') as f:
        texte = f.read()
    
    embedding = embedder.encode(texte, convert_to_numpy=True)
    
    table.add([{"vector": embedding, "text": texte}])
    print(f"Document {fichier_path} ajouté avec succès.")

def recuperer_contexte(query, top_k=3):
    query_embedding = embedder.encode(query, convert_to_numpy=True)
    result = table.search(query_embedding).limit(top_k).to_list()
    return [doc["text"] for doc in result]

