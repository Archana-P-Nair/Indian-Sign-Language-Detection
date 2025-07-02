import os
import pickle
import mediapipe as mp
import cv2

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,  # Detect up to 2 hands
    min_detection_confidence=0.3
)

DATA_DIR = './data'

data = []
labels = []

for dir_ in os.listdir(DATA_DIR):
    for img_path in os.listdir(os.path.join(DATA_DIR, dir_)):
        img = cv2.imread(os.path.join(DATA_DIR, dir_, img_path))
        if img is None:
            continue
            
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)
        
        if results.multi_hand_landmarks:
            data_aux = []
            all_x = []
            all_y = []
            hands_detected = len(results.multi_hand_landmarks)
            
            # Process all detected hands (up to 2)
            for hand_landmarks in results.multi_hand_landmarks:
                # Collect coordinates for each hand
                x_ = []
                y_ = []
                for landmark in hand_landmarks.landmark:
                    x = landmark.x
                    y = landmark.y
                    x_.append(x)
                    y_.append(y)
                    all_x.append(x)
                    all_y.append(y)
                
                # Normalize coordinates relative to hand
                for landmark in hand_landmarks.landmark:
                    data_aux.append(landmark.x - min(x_))
                    data_aux.append(landmark.y - min(y_))
            
            # If only one hand detected, pad with zeros for second hand
            if hands_detected == 1:
                data_aux += [0.0] * 42  # 21 landmarks * 2 coordinates
                
            # Verify we have exactly 84 features (2 hands)
            if len(data_aux) == 84:
                data.append(data_aux)
                labels.append(dir_)
            else:
                print(f"Skipping image {img_path} - unexpected feature count: {len(data_aux)}")
        else:
            print(f"No hands detected in {img_path}")

# Save the dataset
with open('data.pickle', 'wb') as f:
    pickle.dump({'data': data, 'labels': labels}, f)

print(f"Dataset created with {len(data)} samples")