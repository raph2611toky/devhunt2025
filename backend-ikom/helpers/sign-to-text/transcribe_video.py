import cv2
import mediapipe as mp
import numpy as np
from collections import deque

class DynamicSignLanguageConverter:
    def __init__(self, sequence_length=10):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7, min_tracking_confidence=0.5)
        self.mp_drawing = mp.solutions.drawing_utils
        self.sequence_length = sequence_length
        self.hand_sequences = deque(maxlen=sequence_length)
        
        self.gesture_dict = {
            "bonjour": self.is_hello_gesture,
            "merci": self.is_thank_you_gesture,
            # (Autres gestes inchangés, mais vous pouvez limiter pour tester)
        }

    def process_frame(self, frame):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(frame_rgb)
        return frame, results

    def extract_landmarks(self, hand_landmarks):
        landmarks = []
        for lm in hand_landmarks.landmark:
            landmarks.append([lm.x, lm.y, lm.z])
        return np.array(landmarks)

    def is_hello_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        index_tip_start = sequence[0][0][8]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        return (wrist_end[1] < wrist_start[1] - 0.1 and
                abs(index_tip_end[0] - middle_tip_end[0]) > 0.1)

    def is_thank_you_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_mid[1] < 0.4 and
                wrist_end[1] > wrist_start[1] + 0.1)

    # (Autres fonctions de détection inchangées)

    def recognize_gesture(self, sequence):
        for gesture, check_func in self.gesture_dict.items():
            if check_func(sequence):
                return gesture
        return "unknown"

    def video_to_text(self, video_path, output_path="output_video.mp4", frame_skip=5):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print("Erreur : Impossible d'ouvrir la vidéo.")
            return None

        fps = int(cap.get(cv2.CAP_PROP_FPS))
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

        text_output = []
        gesture_timestamps = []  # [frame_index, geste]
        prev_gesture = None
        frame_idx = 0
        display_duration = 3 * fps  # 3 secondes

        print("Traitement de la vidéo en cours...")
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Traiter seulement toutes les `frame_skip` frames pour la détection
            if frame_idx % frame_skip == 0:
                frame, results = self.process_frame(frame)
                current_hands = []

                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        landmarks = self.extract_landmarks(hand_landmarks)
                        current_hands.append(landmarks)

                    self.hand_sequences.append(current_hands)

                    if len(self.hand_sequences) == self.sequence_length:
                        current_gesture = self.recognize_gesture(self.hand_sequences)
                        if current_gesture != "unknown" and current_gesture != prev_gesture:
                            text_output.append(current_gesture)
                            gesture_timestamps.append((frame_idx, current_gesture))
                        prev_gesture = current_gesture
            else:
                # Réutiliser les résultats précédents pour les frames non traitées
                frame, results = self.process_frame(frame)

            # Toujours dessiner les landmarks
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

            # Afficher le texte si dans la fenêtre de 3 secondes
            for timestamp, gesture in gesture_timestamps:
                if timestamp <= frame_idx < timestamp + display_duration:
                    cv2.putText(frame, gesture, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                                1, (0, 255, 0), 2, cv2.LINE_AA)
                    break

            out.write(frame)
            frame_idx += 1

        cap.release()
        out.release()
        print(f"Vidéo générée : {output_path}")
        print(f"Gestes détectés : {len(text_output)}")
        return " ".join(text_output)

def translate(video_path="test.mp4"):
    converter = DynamicSignLanguageConverter(sequence_length=10)
    video_path = video_path
    result = converter.video_to_text(video_path, output_path="output_video.mp4", frame_skip=5)
    if result:
        return result

# translate()
