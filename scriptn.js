const mobileTouch = () => {
	return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
};

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file || !activeFrame) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		const newImageSrc = e.target.result;

		// Update only the clicked frame
		activeFrame.src = newImageSrc;

		const savedImageID = activeFrame.getAttribute("data-saved-image");
		localStorage.setItem("imageSrc-" + savedImageID, newImageSrc);
	};
	reader.readAsDataURL(file);

	// Reset input so same file can be selected again
	fileInput.value = "";
});


let frames = document.getElementsByClassName("frame");

for (let i = 0; i < frames.length; i++) {
	const frame = frames[i];

	// Load saved image (if any)
	const savedImageID = frame.getAttribute("data-saved-image");
	const savedImage = localStorage.getItem("imageSrc-" + savedImageID);
	if (savedImage) {
		frame.src = savedImage;
	}

	let lastTriggerTime = 0;

	function triggerUpload(event) {
		const now = Date.now();
		// Prevent duplicate triggers within 500ms
		if (now - lastTriggerTime < 500) {
			return;
		}
		lastTriggerTime = now;

		activeFrame = frame; // Remember which frame was clicked

		frame.style.transform = "scale(1.1)";
		setTimeout(() => {
			frame.style.transform = "scale(1)";
		}, 300);

        event.preventDefault(); // Prevent default behavior (e.g., dragging)
	}
    
    frame.addEventListener("click", triggerUpload);
}

function clickFrame() {
    try {
        fileInput.click();
    }
    catch (error) {
        alert("Error: " + error.message);
    }
}

// --------------------------------------------------

document.getElementById('imageInput').addEventListener('change', saveImageToLocalStorage);

function saveImageToLocalStorage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // The result is the Base64 data URL string
            const imageDataUrl = e.target.result;

            // Create an image element to load the data URL into
            const img = new Image();
            img.onload = function() {
                // Resize the image before saving it
                const resizedImageDataUrl = resizeImage(img);

                try {
                    // Save the resized image data URL to localStorage
                    localStorage.setItem('savedImage', resizedImageDataUrl);
                    console.log('Image saved to localStorage successfully.');
                    alert('Image saved locally!');
                } catch (e) {
                    console.error('Error saving image to localStorage:', e);
                    // Handle cases where storage limit is exceeded (localStorage has a small limit, usually 5MB)
                    alert('Could not save image. Storage limit might be reached.');
                }
            };

            // Load the image data URL into the image element
            img.src = imageDataUrl;
        };

        // Read the file as a DataURL format (Base64 string)
        reader.readAsDataURL(file);
    }
}

// Function to resize the image while maintaining the aspect ratio
function resizeImage(img) {
    // Define the maximum size for the image (e.g., 1024px on the largest side)
    const MAX_SIZE = 256;

    // Calculate the aspect ratio
    const aspectRatio = img.width / img.height;

    // Calculate new dimensions
    let newWidth = img.width;
    let newHeight = img.height;

    if (newWidth > newHeight) {
        if (newWidth > MAX_SIZE) {
            newWidth = MAX_SIZE;
            newHeight = newWidth / aspectRatio;
        }
    } else {
        if (newHeight > MAX_SIZE) {
            newHeight = MAX_SIZE;
            newWidth = newHeight * aspectRatio;
        }
    }

    // Create a canvas to draw the resized image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas size to the new image dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the resized image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);

    // Convert the resized image to a Base64 string (JPEG format with 0.8 quality to reduce size)
    return canvas.toDataURL('image/jpeg', 0.8); // You can adjust the quality (0.0 to 1.0) for further compression
}

// Function to retrieve and display the image
function fetchImageFromLocalStorage() {
    // Get the data URL string using the key 'savedImage'
    const imageDataUrl = localStorage.getItem('savedImage');

    if (imageDataUrl) {
        // Find an img element and set its src attribute to the data URL
        const imgElement = document.getElementById('displayImage');
        if (imgElement) {
            imgElement.src = imageDataUrl;
        }
    }
}
