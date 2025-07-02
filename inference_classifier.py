import pickle
import cv2
import mediapipe as mp
import numpy as np

# Load the trained model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# MediaPipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5
)

# Labels dictionary
labels_dict = {0: 'A', 1: 'E', 2: 'I', 3: 'O', 4: 'U'}

def predict_hand_letter(image_np):
    """Predict hand sign from a single image frame"""
    try:
        H, W, _ = image_np.shape
        frame_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        data_aux = []
        all_x = []
        all_y = []
        hands_detected = 0

        if results.multi_hand_landmarks:
            hands_detected = len(results.multi_hand_landmarks)
            
            # Collect coordinates for all hands
            for hand_landmarks in results.multi_hand_landmarks:
                for landmark in hand_landmarks.landmark:
                    x = landmark.x
                    y = landmark.y
                    all_x.append(x)
                    all_y.append(y)

            # Normalize coordinates
            if all_x and all_y:
                min_x, min_y = min(all_x), min(all_y)
                for hand_landmarks in results.multi_hand_landmarks:
                    for landmark in hand_landmarks.landmark:
                        data_aux.append(landmark.x - min_x)
                        data_aux.append(landmark.y - min_y)

            # Pad with zeros if only one hand detected
            if hands_detected == 1:
                data_aux += [0.0] * (84 - len(data_aux))

            # Predict only if we have 84 features
            if len(data_aux) == 84:
                prediction = model.predict([np.asarray(data_aux)])
                predicted_character = labels_dict[int(prediction[0])]
                
                # Draw landmarks and bounding box on the image
                for hand_landmarks in results.multi_hand_landmarks:
                    mp.solutions.drawing_utils.draw_landmarks(
                        image_np,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp.solutions.drawing_styles.get_default_hand_landmarks_style(),
                        mp.solutions.drawing_styles.get_default_hand_connections_style()
                    )
                
                if all_x and all_y:
                    x1 = int(min(all_x) * W) - 10
                    y1 = int(min(all_y) * H) - 10
                    x2 = int(max(all_x) * W) + 10
                    y2 = int(max(all_y) * H) + 10
                    cv2.rectangle(image_np, (x1, y1), (x2, y2), (0, 0, 0), 4)
                    cv2.putText(image_np, predicted_character, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3, cv2.LINE_AA)
                
                return predicted_character, image_np
            else:
                return None, "Not enough features for prediction (need 84)"
        else:
            return None, "No hands detected in the image"
            
    except Exception as e:
        return None, f"Prediction error: {str(e)}"