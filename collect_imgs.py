import os
import cv2

DATA_DIR = './data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

number_of_classes = 5
dataset_size = 100

# Try different camera indices (0 is usually the default)
for camera_index in [0, 1, 2]:
    cap = cv2.VideoCapture(camera_index)
    if cap.isOpened():
        print(f"Using camera index {camera_index}")
        break
else:
    print("Error: No camera found!")
    exit()

for j in range(number_of_classes):
    class_dir = os.path.join(DATA_DIR, str(j))
    if not os.path.exists(class_dir):
        os.makedirs(class_dir)

    print(f'Collecting data for class {j}')

    # Wait for 'Q' press
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Couldn't read frame from camera")
            continue
            
        cv2.putText(frame, 'Ready? Press "Q" !', (100, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)
        cv2.imshow('frame', frame)
        if cv2.waitKey(25) == ord('q'):
            break

    # Capture images
    counter = 0
    while counter < dataset_size:
        ret, frame = cap.read()
        if not ret:
            print("Error: Couldn't read frame from camera")
            continue
            
        cv2.imshow('frame', frame)
        cv2.waitKey(25)
        
        # Save image
        img_path = os.path.join(class_dir, f'{counter}.jpg')
        cv2.imwrite(img_path, frame)
        print(f'Saved {img_path}')
        
        counter += 1

cap.release()
cv2.destroyAllWindows()