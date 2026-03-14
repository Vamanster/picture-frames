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
        console.log("Trigger upload for frame", frame);
		const now = Date.now();
		// Prevent duplicate triggers within 500ms
		if (now - lastTriggerTime < 500) {
			return;
		}
		lastTriggerTime = now;

		activeFrame = frame; // Remember which frame was clicked
		fileInput.click();

		frame.style.transform = "scale(1.1)";
		setTimeout(() => {
			frame.style.transform = "scale(1)";
		}, 300);

        event.preventDefault(); // Prevent default behavior (e.g., dragging)
	}
    
    frame.addEventListener("click", triggerUpload);
}