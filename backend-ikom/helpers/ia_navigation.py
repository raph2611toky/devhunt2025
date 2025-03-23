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

async def generer_texte_stream_websocket(texte_entree, modele="mistral", send_callback=None):
    stream = ollama.generate(model=modele, prompt=texte_entree, stream=True)
    resultat = ""
    for chunk in stream:
        morceau = chunk['response']
        resultat += morceau
        if send_callback:
            await send_callback(morceau)  # Envoyer chaque morceau via le callback
        await asyncio.sleep(0.01)  # Petite pause pour éviter de surcharger
    return resultat

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

async def generer_texte_avec_contexte_websocket(texte_entree, modele="mistral", max_tokens=150, temperature=0.7, send_callback=None):
    contexte = recuperer_contexte(texte_entree)
    contexte_texte = "\n".join(contexte) if contexte else "Aucun contexte disponible."
    
    prompt = f"Contexte :\n{contexte_texte}\n\nQuestion : {texte_entree}"
    
    stream = ollama.generate(
        model=modele,
        prompt=prompt,
        stream=True,
        options={
            "num_predict": max_tokens,
            "temperature": temperature
        }
    )
    
    resultat = ""
    for chunk in stream:
        morceau = chunk['response']
        resultat += morceau
        if send_callback:
            await send_callback(morceau)
        await asyncio.sleep(0.008)
    
    return resultat.strip()