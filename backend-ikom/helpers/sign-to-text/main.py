import cv2
import mediapipe as mp
import numpy as np
from collections import deque

class DynamicSignLanguageConverter:
    def __init__(self, sequence_length=10):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7)
        self.mp_drawing = mp.solutions.drawing_utils
        self.sequence_length = sequence_length
        self.hand_sequences = deque(maxlen=sequence_length)
        
        self.gesture_dict = {
            "bonjour": self.is_hello_gesture,
            "merci": self.is_thank_you_gesture,
            "maman": self.is_mother_gesture,
            "oui": self.is_yes_gesture,
            "non": self.is_no_gesture,
            "maison": self.is_house_gesture,
            "eau": self.is_water_gesture,
            "papa": self.is_father_gesture,
            "manger": self.is_eat_gesture,
            "au_revoir": self.is_goodbye_gesture,
            "s_il_te_plait": self.is_please_gesture,
            "ami": self.is_friend_gesture,
            "jour": self.is_day_gesture,
            "nuit": self.is_night_gesture,
            "travail": self.is_work_gesture,
            "famille": self.is_family_gesture,
            "amour": self.is_love_gesture,
            "aide": self.is_help_gesture,
            "temps": self.is_time_gesture,
            "ecole": self.is_school_gesture,
            "jouer": self.is_play_gesture,
            "nourriture": self.is_food_gesture,
            "desole": self.is_sorry_gesture,
            "voiture": self.is_car_gesture,
            "livre": self.is_book_gesture,
            "nom": self.is_name_gesture,
            "grand": self.is_big_gesture,
            "petit": self.is_small_gesture,
            "question": self.is_question_gesture,
            "matin": self.is_morning_gesture,
            "soir": self.is_evening_gesture,
            "soleil": self.is_sun_gesture,
            "pluie": self.is_rain_gesture,
            "chien": self.is_dog_gesture,
            "chat": self.is_cat_gesture,
            "musique": self.is_music_gesture,
            "courir": self.is_run_gesture,
            "dormir": self.is_sleep_gesture,
            "heureux": self.is_happy_gesture,
            "demain": self.is_tomorrow_gesture,  # Nouveau
            "hier": self.is_yesterday_gesture,  # Nouveau
            "maintenant": self.is_now_gesture,  # Nouveau
            "argent": self.is_money_gesture,  # Nouveau
            "arbre": self.is_tree_gesture,  # Nouveau
            "fleur": self.is_flower_gesture,  # Nouveau
            "oiseau": self.is_bird_gesture,  # Nouveau
            "marcher": self.is_walk_gesture,  # Nouveau
            "s_asseoir": self.is_sit_gesture,  # Nouveau
            "se_lever": self.is_stand_gesture  # Nouveau
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

    def is_mother_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        avg_wrist_y = np.mean([frame[0][0][1] for frame in sequence if frame])
        thumb_tip_end = sequence[-1][0][4]
        index_tip_end = sequence[-1][0][8]
        return (avg_wrist_y < 0.4 and
                abs(thumb_tip_end[0] - index_tip_end[0]) < 0.05)

    def is_water_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        ring_tip_end = sequence[-1][0][16]
        return (wrist_end[1] < wrist_start[1] - 0.05 and
                abs(index_tip_end[0] - middle_tip_end[0]) < 0.1 and
                ring_tip_end[1] > middle_tip_end[1])

    def is_yes_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_positions = [frame[0][0][1] for frame in sequence if frame]
        mid_point = self.sequence_length // 2
        return (max(wrist_positions[:mid_point]) > min(wrist_positions[mid_point:]) + 0.05 and
                max(wrist_positions[mid_point:]) > min(wrist_positions[:mid_point]) + 0.05)

    def is_no_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_positions = [frame[0][0][0] for frame in sequence if frame]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        return (max(wrist_positions) - min(wrist_positions) > 0.15 and
                abs(index_tip_end[0] - middle_tip_end[0]) < 0.1)

    def is_house_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        left_hand = sequence[-1][0]
        right_hand = sequence[-1][1]
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = left_hand[0]
        wrist_right_end = right_hand[0]
        return (wrist_left_end[0] > wrist_left_start[0] and
                wrist_right_end[0] < wrist_right_start[0] and
                abs(left_hand[8][1] - right_hand[8][1]) < 0.1)

    def is_father_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        index_tip_end = sequence[-1][0][8]
        return (wrist_start[1] < 0.3 and
                wrist_end[1] > wrist_start[1] + 0.05 and
                abs(index_tip_end[0] - wrist_end[0]) < 0.1)

    def is_eat_gesture(self, sequence):
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_mid[1] < 0.5 and
                wrist_start[1] > wrist_mid[1] + 0.05 and
                wrist_end[1] > wrist_mid[1] + 0.05)

    def is_goodbye_gesture(self, sequence):
        """'Au revoir' : main qui s'éloigne en descendant"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] > wrist_start[1] + 0.1 and  # descente
                abs(wrist_end[0] - wrist_start[0]) > 0.15)  # éloignement horizontal

    def is_please_gesture(self, sequence):
        """'S'il te plaît' : main qui tourne près de la poitrine"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.6 and wrist_end[1] < 0.6 and  # près de la poitrine
                abs(wrist_mid[0] - wrist_start[0]) > 0.1 and  # mouvement latéral
                abs(wrist_end[0] - wrist_start[0]) < 0.05)  # revient près du départ

    def is_friend_gesture(self, sequence):
        """'Ami' : deux mains qui se rapprochent horizontalement"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[0] > wrist_left_start[0] and  # gauche vers droite
                wrist_right_end[0] < wrist_right_start[0] and  # droite vers gauche
                abs(wrist_left_end[1] - wrist_right_end[1]) < 0.1)  # même hauteur

    def is_day_gesture(self, sequence):
        """'Jour' : main qui monte horizontalement près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] < wrist_start[1] - 0.05 and  # montée
                wrist_start[1] < 0.4 and  # près du visage
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_night_gesture(self, sequence):
        """'Nuit' : main qui descend près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] > wrist_start[1] + 0.05 and  # descente
                wrist_start[1] < 0.4 and  # près du visage
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_work_gesture(self, sequence):
        """'Travail' : deux mains qui se croisent en descendant"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[1] > wrist_left_start[1] + 0.05 and  # descente
                wrist_right_end[1] > wrist_right_start[1] + 0.05 and  # descente
                wrist_left_end[0] > wrist_right_end[0])  # croisement

    def is_family_gesture(self, sequence):
        """'Famille' : deux mains qui forment un cercle"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_mid = sequence[self.sequence_length//2][0][0]
        wrist_right_mid = sequence[self.sequence_length//2][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (abs(wrist_left_mid[0] - wrist_right_mid[0]) > 0.2 and  # écart au milieu
                abs(wrist_left_end[0] - wrist_right_end[0]) < 0.1)  # rapprochement à la fin

    def is_love_gesture(self, sequence):
        """'Amour' : deux mains qui se rapprochent près du cœur"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[1] < 0.6 and wrist_right_end[1] < 0.6 and  # près du cœur
                abs(wrist_left_end[0] - wrist_right_end[0]) < 0.1)  # rapprochement

    def is_help_gesture(self, sequence):
        """'Aide' : main qui monte vers l'autre main"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_lower_start = sequence[0][0][0]
        wrist_upper_start = sequence[0][1][0]
        wrist_lower_end = sequence[-1][0][0]
        return (wrist_lower_end[1] < wrist_lower_start[1] - 0.1 and  # montée
                abs(wrist_lower_end[1] - wrist_upper_start[1]) < 0.1)  # près de l'autre main

    def is_time_gesture(self, sequence):
        """'Temps' : main qui tourne près du poignet"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.7 and wrist_end[1] < 0.7 and  # près du poignet
                abs(wrist_mid[0] - wrist_start[0]) > 0.1 and  # mouvement latéral
                abs(wrist_end[0] - wrist_start[0]) < 0.05)  # revient près du départ        


    def recognize_gesture(self, sequence):
        for gesture, check_func in self.gesture_dict.items():
            if check_func(sequence):
                return gesture
        return "unknown"

    def video_to_text(self, video_path):
        cap = cv2.VideoCapture(video_path)
        text_output = []
        prev_gesture = None
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame, results = self.process_frame(frame)
            current_hands = []  # Liste des mains détectées dans cette frame
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
                    landmarks = self.extract_landmarks(hand_landmarks)
                    current_hands.append(landmarks)
                
                self.hand_sequences.append(current_hands)
                
                if len(self.hand_sequences) == self.sequence_length:
                    current_gesture = self.recognize_gesture(self.hand_sequences)
                    if current_gesture != "unknown" and current_gesture != prev_gesture:
                        print(f"{current_gesture} | ")
                        text_output.append(current_gesture)
                    prev_gesture = current_gesture

            cv2.imshow('Dynamic Sign Language Detection', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        return " ".join(text_output)
    
    def is_school_gesture(self, sequence):
        """'École' : deux mains qui se rapprochent à hauteur de tête"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[1] < 0.4 and wrist_right_end[1] < 0.4 and  # près de la tête
                wrist_left_end[0] > wrist_left_start[0] and  # gauche vers droite
                wrist_right_end[0] < wrist_right_start[0])  # droite vers gauche

    def is_play_gesture(self, sequence):
        """'Jouer' : main qui bouge rapidement de haut en bas"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_positions = [frame[0][0][1] for frame in sequence if frame]
        mid_point = self.sequence_length // 2
        return (max(wrist_positions[:mid_point]) > min(wrist_positions[mid_point:]) + 0.1 and  # descente
                max(wrist_positions[mid_point:]) > min(wrist_positions[:mid_point]) + 0.1)  # remontée rapide

    def is_food_gesture(self, sequence):
        """'Nourriture' : main qui va vers la bouche et reste stable"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_mid[1] < 0.5 and wrist_end[1] < 0.5 and  # près de la bouche
                abs(wrist_end[1] - wrist_mid[1]) < 0.05 and  # stable
                wrist_start[1] > wrist_mid[1] + 0.05)  # éloigné au début

    def is_sorry_gesture(self, sequence):
        """'Désolé' : main qui tourne près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.4 and wrist_end[1] < 0.4 and  # près du visage
                abs(wrist_mid[0] - wrist_start[0]) > 0.1 and  # mouvement latéral
                abs(wrist_end[0] - wrist_start[0]) < 0.05)  # revient près du départ

    def is_car_gesture(self, sequence):
        """'Voiture' : deux mains qui simulent un volant"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_mid = sequence[self.sequence_length//2][0][0]
        wrist_right_mid = sequence[self.sequence_length//2][1][0]
        return (abs(wrist_left_mid[0] - wrist_right_mid[0]) > 0.2 and  # écart horizontal
                wrist_left_mid[1] < 0.7 and wrist_right_mid[1] < 0.7 and  # hauteur moyenne
                abs(wrist_left_mid[1] - wrist_right_mid[1]) < 0.1)  # même niveau

    def is_book_gesture(self, sequence):
        """'Livre' : deux mains qui s'ouvrent"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        index_left_start = sequence[0][0][8]
        index_right_start = sequence[0][1][8]
        index_left_end = sequence[-1][0][8]
        index_right_end = sequence[-1][1][8]
        return (abs(index_left_end[0] - index_right_end[0]) > abs(index_left_start[0] - index_right_start[0]) + 0.1 and  # doigts s'écartent
                abs(index_left_end[1] - index_right_end[1]) < 0.1)  # même hauteur

    def is_name_gesture(self, sequence):
        """'Nom' : main qui descend près du menton"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.5 and  # près du menton
                wrist_end[1] > wrist_start[1] + 0.05 and  # descente
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_big_gesture(self, sequence):
        """'Grand' : deux mains qui s'écartent"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[0] < wrist_left_start[0] and  # gauche vers la gauche
                wrist_right_end[0] > wrist_right_start[0])  # droite vers la droite

    def is_small_gesture(self, sequence):
        """'Petit' : deux mains qui se rapprochent près du corps"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[0] > wrist_left_start[0] and  # gauche vers droite
                wrist_right_end[0] < wrist_right_start[0] and  # droite vers gauche
                wrist_left_end[1] > 0.6 and wrist_right_end[1] > 0.6)  # près du corps

    def is_question_gesture(self, sequence):
        """'Question' : main qui monte et tourne près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] < wrist_start[1] - 0.05 and  # montée
                wrist_start[1] < 0.4 and  # près du visage
                abs(wrist_mid[0] - wrist_start[0]) > 0.1)  # mouvement latéral

    def is_morning_gesture(self, sequence):
        """'Matin' : main qui monte près du visage avec doigts écartés"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        return (wrist_end[1] < wrist_start[1] - 0.05 and  # montée
                wrist_start[1] < 0.4 and  # près du visage
                abs(index_tip_end[0] - middle_tip_end[0]) > 0.1)  # doigts écartés

    def is_evening_gesture(self, sequence):
        """'Soir' : main qui descend près du menton"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] > wrist_start[1] + 0.05 and  # descente
                wrist_start[1] < 0.5 and  # près du menton
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_sun_gesture(self, sequence):
        """'Soleil' : main qui forme un cercle près de la tête"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.3 and wrist_end[1] < 0.3 and  # près de la tête
                abs(wrist_mid[0] - wrist_start[0]) > 0.1 and  # mouvement latéral
                abs(wrist_end[0] - wrist_start[0]) < 0.05)  # revient au point de départ

    def is_rain_gesture(self, sequence):
        """'Pluie' : deux mains qui descendent en zigzag"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_mid = sequence[self.sequence_length//2][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_mid[1] > wrist_left_start[1] + 0.1 and  # descente
                wrist_right_end[1] > wrist_right_start[1] + 0.1 and  # descente
                abs(wrist_left_mid[0] - wrist_left_start[0]) > 0.05)  # mouvement latéral

    def is_dog_gesture(self, sequence):
        """'Chien' : main qui descend près de la jambe"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] > wrist_start[1] + 0.2 and  # descente significative
                wrist_end[1] > 0.8 and  # près de la jambe
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_cat_gesture(self, sequence):
        """'Chat' : main qui bouge latéralement près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.4 and wrist_end[1] < 0.4 and  # près du visage
                abs(wrist_mid[0] - wrist_start[0]) > 0.15 and  # mouvement latéral
                abs(wrist_end[1] - wrist_start[1]) < 0.05)  # même hauteur

    def is_music_gesture(self, sequence):
        """'Musique' : main qui ondule près de l'oreille"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_positions = [frame[0][0][1] for frame in sequence if frame]
        mid_point = self.sequence_length // 2
        return (wrist_positions[0] < 0.3 and wrist_positions[-1] < 0.3 and  # près de l'oreille
                max(wrist_positions[:mid_point]) > min(wrist_positions[mid_point:]) + 0.05 and  # ondulation
                max(wrist_positions[mid_point:]) > min(wrist_positions[:mid_point]) + 0.05)

    def is_run_gesture(self, sequence):
        """'Courir' : deux mains qui alternent rapidement"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_positions = [frame[0][0][1] for frame in sequence if frame]
        wrist_right_positions = [frame[1][0][1] for frame in sequence if frame]
        mid_point = self.sequence_length // 2
        return (max(wrist_left_positions[:mid_point]) > min(wrist_right_positions[:mid_point]) + 0.1 and  # alternance
                max(wrist_right_positions[mid_point:]) > min(wrist_left_positions[mid_point:]) + 0.1)

    def is_sleep_gesture(self, sequence):
        """'Dormir' : main qui descend près du visage et reste basse"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.4 and  # près du visage
                wrist_mid[1] > wrist_start[1] + 0.1 and  # descente
                abs(wrist_end[1] - wrist_mid[1]) < 0.05)  # reste stable en bas

    def is_happy_gesture(self, sequence):
        """'Heureux' : deux mains qui montent près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[1] < wrist_left_start[1] - 0.05 and  # montée
                wrist_right_end[1] < wrist_right_start[1] - 0.05 and  # montée
                wrist_left_end[1] < 0.4 and wrist_right_end[1] < 0.4)  # près du visage

    def is_tomorrow_gesture(self, sequence):
        """'Demain' : main qui avance près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.4 and wrist_end[1] < 0.4 and  # près du visage
                wrist_end[0] > wrist_start[0] + 0.1 and  # avance vers la droite
                abs(wrist_end[1] - wrist_start[1]) < 0.05)  # même hauteur

    def is_yesterday_gesture(self, sequence):
        """'Hier' : main qui recule près du visage"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_start[1] < 0.4 and wrist_end[1] < 0.4 and  # près du visage
                wrist_end[0] < wrist_start[0] - 0.1 and  # recule vers la gauche
                abs(wrist_end[1] - wrist_start[1]) < 0.05)  # même hauteur

    def is_now_gesture(self, sequence):
        """'Maintenant' : main qui descend près du corps"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] > wrist_start[1] + 0.1 and  # descente
                wrist_end[1] > 0.6 and  # près du corps
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

    def is_money_gesture(self, sequence):
        """'Argent' : main qui frotte les doigts près du menton"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        thumb_tip_mid = sequence[self.sequence_length//2][0][4]
        index_tip_mid = sequence[self.sequence_length//2][0][8]
        return (wrist_start[1] < 0.5 and  # près du menton
                abs(thumb_tip_mid[0] - index_tip_mid[0]) < 0.05 and  # doigts proches
                abs(thumb_tip_mid[1] - index_tip_mid[1]) < 0.05)  # frottement

    def is_tree_gesture(self, sequence):
        """'Arbre' : main qui monte avec doigts écartés"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        return (wrist_end[1] < wrist_start[1] - 0.1 and  # montée
                abs(index_tip_end[0] - middle_tip_end[0]) > 0.1 and  # doigts écartés
                wrist_end[1] < 0.6)  # hauteur moyenne

    def is_flower_gesture(self, sequence):
        """'Fleur' : main qui s'ouvre près du nez"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        index_tip_start = sequence[0][0][8]
        middle_tip_start = sequence[0][0][12]
        index_tip_end = sequence[-1][0][8]
        middle_tip_end = sequence[-1][0][12]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] < 0.4 and  # près du nez
                abs(index_tip_end[0] - middle_tip_end[0]) > abs(index_tip_start[0] - middle_tip_start[0]) + 0.1)  # doigts s'écartent

    def is_bird_gesture(self, sequence):
        """'Oiseau' : deux mains qui battent des ailes"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_positions = [frame[0][0][1] for frame in sequence if frame]
        wrist_right_positions = [frame[1][0][1] for frame in sequence if frame]
        mid_point = self.sequence_length // 2
        return (max(wrist_left_positions[:mid_point]) > min(wrist_right_positions[:mid_point]) + 0.05 and  # alternance
                max(wrist_right_positions[mid_point:]) > min(wrist_left_positions[mid_point:]) + 0.05)

    def is_walk_gesture(self, sequence):
        """'Marcher' : deux mains qui alternent lentement"""
        if len(sequence) < self.sequence_length or not sequence[0] or not sequence[-1]:
            return False
        if len(sequence[0]) < 2 or len(sequence[-1]) < 2:
            return False
        wrist_left_start = sequence[0][0][0]
        wrist_right_start = sequence[0][1][0]
        wrist_left_end = sequence[-1][0][0]
        wrist_right_end = sequence[-1][1][0]
        return (wrist_left_end[1] > wrist_left_start[1] + 0.05 and  # descente lente
                wrist_right_end[1] < wrist_right_start[1] - 0.05 and  # montée opposée
                abs(wrist_left_end[0] - wrist_right_end[0]) < 0.2)  # proche horizontalement

    def is_sit_gesture(self, sequence):
        """'S'asseoir' : main qui descend et reste basse"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_mid = sequence[self.sequence_length//2][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_mid[1] > wrist_start[1] + 0.1 and  # descente
                abs(wrist_end[1] - wrist_mid[1]) < 0.05 and  # reste stable
                wrist_end[1] > 0.7)  # près du bas

    def is_stand_gesture(self, sequence):
        """'Se lever' : main qui monte depuis le bas"""
        if len(sequence) < self.sequence_length or not sequence[0]:
            return False
        wrist_start = sequence[0][0][0]
        wrist_end = sequence[-1][0][0]
        return (wrist_end[1] < wrist_start[1] - 0.1 and  # montée
                wrist_start[1] > 0.7 and  # commence bas
                abs(wrist_end[0] - wrist_start[0]) < 0.1)  # peu de mouvement horizontal

def main():
    converter = DynamicSignLanguageConverter(sequence_length=10)
    video_path = "test.mp4"
    result = converter.video_to_text(video_path)
    print(f"Texte traduit : {result}")

if __name__ == "__main__":
    main()
    
