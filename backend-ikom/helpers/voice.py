import pyttsx3

def text_to_speech(texte, file_to_save="output_speech.wav"):
    try:
        engine = pyttsx3.init()

        voices = engine.getProperty('voices')
        if voices:
            engine.setProperty('voice', voices[0].id)
        else:
            raise ValueError("Aucune voix disponible.")
        engine.setProperty('rate', 145)
        engine.setProperty('volume', 1.0)
        engine.save_to_file(texte, file_to_save)
        engine.runAndWait()

        print(f"Audio sauvegardé avec succès dans : {file_to_save}")
        return file_to_save

    except Exception as e:
        print(f"Erreur lors de la génération de la voix : {str(e)}")
        return None
