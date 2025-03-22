from __future__ import print_function
import numpy as np
from PIL import Image
import pytesseract
import cv2
import traceback
import os
import face_recognition

def face_recognition_save(image_path, directory_to_save, filename_to_save):
    if not os.path.exists(image_path):
        print(f"Error: Image path {image_path} does not exist.")
        return None
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image at {image_path}.")
        return None
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray_image = cv2.equalizeHist(gray_image)
    gray_image = cv2.GaussianBlur(gray_image, (5, 5), 0)

    face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    if face_classifier.empty():
        print("Error: Could not load face classifier.")
        return None
    faces = face_classifier.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))
    if len(faces) == 0:
        print("No faces detected in the image.")
        return None
    largest_face = None
    max_area = 0
    for (x, y, w, h) in faces:
        area = w * h
        if area > max_area:
            max_area = area
            largest_face = (x, y, w, h)

    if largest_face is None:
        print("No suitable face found.")
        return None
    (x, y, w, h) = largest_face
    padding_ratio = 0.2 
    padding_w = int(w * padding_ratio)
    padding_h = int(h * padding_ratio) 

    x = max(0, x - padding_w)
    y = max(0, y - padding_h)
    w = min(image.shape[1] - x, w + 2 * padding_w)
    h = min(image.shape[0] - y, h + 2 * padding_h)
    padding = 10
    x = max(0, x - padding)
    y = max(0, y - padding)
    w = min(image.shape[1] - x, w + 2 * padding)
    h = min(image.shape[0] - y, h + 2 * padding)

    cropped_face = image[y:y + h, x:x + w]
    if not os.path.exists(directory_to_save):
        os.makedirs(directory_to_save)
    output_path = os.path.join(directory_to_save, f"{filename_to_save}_face.jpg")
    cv2.imwrite(output_path, cropped_face)
    print(f"Face saved to {output_path}")

    return output_path

def remove_non_colors(image_path, color_ranges, exclude_skin=True):
    if not os.path.exists(image_path):
        print(f"Error: Image path {image_path} does not exist.")
        return None
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image at {image_path}.")
        return None
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    combined_mask = None
    for lower, upper in color_ranges:
        mask = cv2.inRange(hsv_image, np.array(lower), np.array(upper))
        if combined_mask is None:
            combined_mask = mask
        else:
            combined_mask = cv2.bitwise_or(combined_mask, mask)
    if exclude_skin:
        lower_skin = np.array([0, 20, 70])
        upper_skin = np.array([20, 255, 255])
        skin_mask = cv2.inRange(hsv_image, lower_skin, upper_skin)
        combined_mask = cv2.bitwise_and(combined_mask, cv2.bitwise_not(skin_mask))
    kernel = np.ones((5, 5), np.uint8)
    combined_mask = cv2.dilate(combined_mask, kernel, iterations=1)
    combined_mask = cv2.erode(combined_mask, kernel, iterations=1)

    result_image = image.copy()
    result_image[combined_mask == 0] = [255, 255, 255]

    return result_image

def remove_non_red_colors(image_path):
    red_ranges = [
        ([0, 50, 50], [15, 255, 255]),
        ([165, 50, 50], [180, 255, 255])
    ]
    return remove_non_colors(image_path, red_ranges, exclude_skin=True)

def remove_non_blueblack_colors(image_path):
    blue_ranges = [
        ([90, 50, 50], [130, 255, 255])
    ]
    black_ranges = [
        ([0, 0, 0], [180, 255, 40])
    ]
    dark_ranges = [
        ([0, 0, 40], [180, 255, 80])
    ]
    gray_ranges = [
        ([0, 0, 20], [180, 30, 150])
    ]
    color_ranges = blue_ranges + black_ranges + dark_ranges + gray_ranges
    return remove_non_colors(image_path, color_ranges, exclude_skin=False)

def stamp_recognition(image_path, directory_to_save):
    try:
        image = remove_non_red_colors(image_path)
        if image is None:
            print(f"Error: Could not load red-only image at {image_path}.")
            return None

        height, width = image.shape[:2]
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray_blurred = cv2.GaussianBlur(gray_image, (9, 9), 2)

        circles = cv2.HoughCircles(
            gray_blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=50,
            param1=50,
            param2=25,
            minRadius=20,
            maxRadius=150
        )

        if circles is None:
            print("No circles detected in the red-only image.")
            return None

        circles = np.uint16(np.around(circles))
        best_circle = circles[0, 0]

        x, y, radius = best_circle
        padding_ratio = 0.3
        padding = int(radius * padding_ratio)
        x = max(0, x - radius - padding)
        y = max(0, y - radius - padding)
        w = min(width - x, 2 * (radius + padding))
        h = min(height - y, 2 * (radius + padding))

        cropped_stamp = image[y:y + h, x:x + w]

        if not os.path.exists(directory_to_save):
            os.makedirs(directory_to_save)

        return True
    except Exception as e:
        print(e)
        return False

def image_to_text(image_path):
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if not os.path.exists(image_path):
        return None
    image_filtered_color = cv2.imwrite("./test.jpg", remove_non_blueblack_colors(image_path))
    image = Image.open(image_path)
    image_arr = np.asarray(image)
    gray_image = cv2.cvtColor(image_arr, cv2.COLOR_RGB2GRAY)
    denoised_image = cv2.fastNlMeansDenoising(gray_image, None, 30, 7, 21)
    adaptive_thresh_image = cv2.adaptiveThreshold(
    denoised_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    text = pytesseract.image_to_string(adaptive_thresh_image, lang='fra')
    return text

def compare_faces(saved_image_path, selfie_image_path, threshold=0.5):
    try:
        img = cv2.imread(saved_image_path)
        if img is None:
            raise ValueError(f"Could not load image at {saved_image_path}")
        
        img_selfie = cv2.imread(selfie_image_path)
        if img_selfie is None:
            raise ValueError(f"Could not load image at {selfie_image_path}")

        rgb_img = np.ascontiguousarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        rgb_img_selfie = np.ascontiguousarray(cv2.cvtColor(img_selfie, cv2.COLOR_BGR2RGB))

        print(f"Saved image shape: {rgb_img.shape}, dtype: {rgb_img.dtype}, contiguous: {rgb_img.flags['C_CONTIGUOUS']}")
        print(f"Selfie image shape: {rgb_img_selfie.shape}, dtype: {rgb_img_selfie.dtype}, contiguous: {rgb_img_selfie.flags['C_CONTIGUOUS']}")

        saved_face_locations = face_recognition.face_locations(rgb_img)
        selfie_face_locations = face_recognition.face_locations(rgb_img_selfie)

        if not saved_face_locations:
            print(f"No faces detected in saved image: {saved_image_path}")
            return False, None
        if not selfie_face_locations:
            print(f"No faces detected in selfie image: {selfie_image_path}")
            return False, None

        img_encoding = face_recognition.face_encodings(rgb_img, saved_face_locations)[0]
        img_selfie_encoding = face_recognition.face_encodings(rgb_img_selfie, selfie_face_locations)[0]

        result = face_recognition.compare_faces([img_encoding], img_selfie_encoding, tolerance=threshold)
        distance = face_recognition.face_distance([img_encoding], img_selfie_encoding)[0]
        print(f"Comparison result: {result}")
        print(f"Distance: {distance:.4f}")
        return result[0], distance

    except Exception as e:
        print(f"Error in face comparison: {str(e)}")
        print(traceback.format_exc())
        return False, None
