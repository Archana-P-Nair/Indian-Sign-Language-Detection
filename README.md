# Indian Sign Language (ISL) Detection 🤟✨

Welcome to ISL Detection! 
This project helps you recognize Indian Sign Language (ISL) vowels (A, E, I, O, U) using a webcam or uploaded images. With a simple web app, you can see hand gestures come to life as the system detects and displays the corresponding ISL letter. 
It's a fun and meaningful way to explore technology and support inclusive communication for the Deaf and hard-of-hearing community in India.

## Why ISL Matters🚀
Indian Sign Language is a vibrant part of Deaf culture in India, used by millions to communicate. This project is a small step toward making technology more inclusive and fun for everyone.💖

## What’s This Project About? 🌟

ISL Detection is a beginner-friendly tool that uses machine learning to spot ISL vowel signs. Powered by MediaPipe for hand tracking and a Flask web app for an interactive experience, it’s perfect for anyone curious about sign language! 📸 Whether you’re using a webcam or uploading images, the app detects hand gestures, predicts the ISL letter, and shows it with neat visuals like hand landmarks and bounding boxes. 🖼️

## 🎯 Why It’s So Cool:
🕹️ Real-Time Magic: See your hand signs become ISL letters instantly! 🚀
📱 Super Easy: Use your webcam or upload a photo—no tech wizardry needed! 🧙‍♂️
🤝 Inclusive Vibes: Helps connect with over 7 million Deaf folks in India. 💬
🛠️ Make It Yours: Tools to create and train your own dataset. 🧠

## What’s in the Box? 📦
collect_imgs.py: Snaps photos from your webcam to build your dataset. 📷
create_dataset.py: Turns images into hand landmark data and saves it as data.pickle. 📊
train_classifier.py: Trains a Random Forest model and saves it as model.p. 🧑‍💻
inference_classifier.py: Predicts ISL letters from new images or video. 🔍
app.py: Runs the Flask web app for all the fun stuff! 🌐
templates/index.html: The main webpage for webcam and image uploads. 🖥️
templates/about.html: Learn about ISL and why it’s awesome. ℹ️
static/: Holds processed images and other goodies. 🗂️
data/: Stores your dataset images. 📂

## Some Prerequisites
Python 3.8+: Make sure it’s installed on your computer. 🐍
Libraries: Install opencv-python, mediapipe, numpy, scikit-learn, flask, and pillow.📚
Webcam: For collecting data and testing with live video. 📹
A Curious Mind: Ready to explore sign language and tech!😄

# What’s Next?
Add more ISL signs beyond vowels.🔤
Make it work better in tricky lighting or busy backgrounds.🖼️
Try real-time video predictions for a smoother experience. 🎥

# Happy signing, and have fun exploring ISL Detection! 🤩✨
