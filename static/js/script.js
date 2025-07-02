/*document.addEventListener('DOMContentLoaded', function() {
    const webcamBtn = document.getElementById('webcamBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const webcamMode = document.getElementById('webcamMode');
    const uploadMode = document.getElementById('uploadMode');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const webcamResult = document.getElementById('webcamResult');
    const uploadForm = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const uploadResult = document.getElementById('uploadResult');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Switch between modes
    webcamBtn.addEventListener('click', function() {
        this.classList.add('active');
        uploadBtn.classList.remove('active');
        webcamMode.style.display = 'block';
        uploadMode.style.display = 'none';
        startWebcam();
    });

    uploadBtn.addEventListener('click', function() {
        this.classList.add('active');
        webcamBtn.classList.remove('active');
        webcamMode.style.display = 'none';
        uploadMode.style.display = 'block';
        stopWebcam();
    });

    // Webcam functionality
    let stream = null;

    function startWebcam() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream;
                video.srcObject = mediaStream;
            })
            .catch(function(error) {
                webcamResult.textContent = "Error accessing webcam. Please ensure you've granted camera permissions.";
            });
        } else {
            webcamResult.textContent = "Webcam access not supported in your browser.";
        }
    }

    function stopWebcam() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    // Capture and predict
    captureBtn.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        webcamResult.innerHTML = "⏳ Predicting gesture...";
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.gesture) {
                webcamResult.innerHTML = `<span style="font-size:2rem;">🤚</span><br><b>Detected Gesture:</b> ${data.gesture}`;
                webcamResult.classList.add('animate');
                setTimeout(()=>webcamResult.classList.remove('animate'), 600);
            } else {
                webcamResult.textContent = "No hand gesture detected. Try again.";
            }
        })
        .catch(error => {
            webcamResult.textContent = "Error processing the image. Please try again.";
        });
    });

    // Upload and predict
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = imageInput.files[0];
        if (!file) {
            uploadResult.textContent = "Please select an image to upload.";
            return;
        }
        uploadResult.innerHTML = "⏳ Predicting gesture...";
        const formData = new FormData();
        formData.append('image', file);
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.gesture) {
                uploadResult.innerHTML = `<span style="font-size:2rem;">🤚</span><br><b>Detected Gesture:</b> ${data.gesture}`;
                uploadResult.classList.add('animate');
                setTimeout(()=>uploadResult.classList.remove('animate'), 600);
            } else {
                uploadResult.textContent = "No hand gesture detected. Try again.";
            }
        })
        .catch(error => {
            uploadResult.textContent = "Error processing the image. Please try again.";
        });
    });

    // Animate result card
    const style = document.createElement('style');
    style.innerHTML = `
        .animate { animation: pop 0.6s; }
        @keyframes pop {
            0% { transform: scale(0.8); opacity: 0.6; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize webcam mode by default
    startWebcam();
});*/

document.addEventListener('DOMContentLoaded', function() {
    const webcamBtn = document.getElementById('webcamBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const webcamMode = document.getElementById('webcamMode');
    const uploadMode = document.getElementById('uploadMode');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const webcamResult = document.getElementById('webcamResult');
    const uploadForm = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const uploadResult = document.getElementById('uploadResult');
    
    const processedImageContainer = document.getElementById('processedImageContainer');
    const processedImage = document.getElementById('processedImage');
    const letterResult = document.getElementById('letterResult');
    const message = document.getElementById('message');

    

    // Switch between modes
    webcamBtn.addEventListener('click', function() {
        this.classList.add('active');
        uploadBtn.classList.remove('active');
        webcamMode.style.display = 'block';
        uploadMode.style.display = 'none';
        startWebcam();
    });

    uploadBtn.addEventListener('click', function() {
        this.classList.add('active');
        webcamBtn.classList.remove('active');
        webcamMode.style.display = 'none';
        uploadMode.style.display = 'block';
        stopWebcam();
    });

    // Webcam functionality
    let stream = null;

    function startWebcam() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            })
            .then(function(mediaStream) {
                stream = mediaStream;
                video.srcObject = mediaStream;
                video.play();
            })
            .catch(function(error) {
                webcamResult.textContent = "Error accessing webcam. Please ensure you've granted camera permissions.";
                console.error("Webcam error:", error);
            });
        } else {
            webcamResult.textContent = "Webcam access not supported in your browser.";
        }
    }

    function stopWebcam() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            video.srcObject = null;
        }
    }

    // Capture and predict
    captureBtn.addEventListener('click', async function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        webcamResult.innerHTML = "⏳ Predicting letter...";
        
        try {
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                webcamResult.textContent = data.error;
            } else if (data.letter) {
                webcamResult.innerHTML = `
                    <span style="font-size:2rem;">${data.letter}</span><br>
                    <b>Detected Letter:</b> ${data.letter}
                `;
            } else {
                webcamResult.textContent = "No hand letter detected. Please try again.";
            }
        } catch (error) {
            console.error("Prediction error:", error);
            webcamResult.textContent = "Error predicting letter. Please try again.";
        }
        
        webcamResult.classList.add('animate');
        setTimeout(() => webcamResult.classList.remove('animate'), 600);
    });

    // Upload and predict
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            uploadResult.textContent = "Please select an image to upload.";
            return;
        }
        
        uploadResult.innerHTML = "⏳ Predicting letter...";
        processedImageContainer.style.display = 'none';
        message.style.display = 'none';
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                uploadResult.textContent = data.error;
                message.style.display = 'block';
                message.textContent = data.error;
            } else if (data.letter) {
                uploadResult.innerHTML = `
                    <span style="font-size:2rem;">${data.letter}</span><br>
                    <b>Detected Letter:</b> ${data.letter}
                `;
                
                if (data.processed_image) {
                    processedImageContainer.style.display = 'block';
                    processedImage.src = data.processed_image;
                    letterResult.textContent = data.letter;
                }
            } else {
                uploadResult.textContent = "No hand letter detected. Please try again.";
            }
        } catch (error) {
            console.error("Upload error:", error);
            uploadResult.textContent = "Error processing the image. Please try again.";
            message.style.display = 'block';
            message.textContent = "Error processing the image. Please try again.";
        }
        
        uploadResult.classList.add('animate');
        setTimeout(() => uploadResult.classList.remove('animate'), 600);
    });

    // Animate result card
    const style = document.createElement('style');
    style.innerHTML = `
        .animate { animation: pop 0.6s; }
        @keyframes pop {
            0% { transform: scale(0.8); opacity: 0.6; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize webcam mode by default
    startWebcam();
});
