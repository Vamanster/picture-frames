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

            try {
                // Save the data URL string to localStorage
                // 'savedImage' is the key, imageDataUrl is the value
                localStorage.setItem('savedImage', imageDataUrl);
                console.log('Image saved to localStorage successfully.');
                alert('Image saved locally!');
            } catch (e) {
                console.error('Error saving image to localStorage:', e);
                // Handle cases where storage limit is exceeded (localStorage has a small limit, usually 5MB)
                alert('Could not save image. Storage limit might be reached.');
            }
        };

        // Read the file as a DataURL format (Base64 string)
        reader.readAsDataURL(file);
    }
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

function handleFileSelect(event) {
    saveImageToLocalStorage(event);
    fetchImageFromLocalStorage();
}