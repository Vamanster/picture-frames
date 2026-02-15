const fileInput = document.getElementById("fileInput");
let frames = document.getElementsByClassName("frame");

let activeFrame = null; // Track which frame was clicked

function mobileTouch() {
	return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

// Attach change listener ONLY ONCE
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

for (let i = 0; i < frames.length; i++) {
	const frame = frames[i];

	frame.setAttribute("draggable", "false");

	// Load saved image (if any)
	const savedImageID = frame.getAttribute("data-saved-image");
	const savedImage = localStorage.getItem("imageSrc-" + savedImageID);
	if (savedImage) {
		frame.src = savedImage;
	}

	function triggerUpload() {
		activeFrame = frame; // Remember which frame was clicked
		fileInput.click();

		frame.style.transform = "scale(1.1)";
		setTimeout(() => {
			frame.style.transform = "scale(1)";
		}, 300);
	}

	frame.addEventListener("dblclick", triggerUpload);

	frame.addEventListener("click", e => {
		if (mobileTouch()) {
			triggerUpload();
		}
	});
}

// Menu panel
let menuOpen = false;

const menu = document.getElementById("menu");
menu.addEventListener("click", () => {
	if(!menuOpen){
		menuOpen = !menuOpen;
		menu.classList.toggle("menu-expanded");
	}
});

document.addEventListener("click", (e) => {
	if(menuOpen && !menu.contains(e.target)) {
		menuOpen = !menuOpen;
		menu.classList.remove("menu-expanded");
	}
});

// Swipe between frames

const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;

let currentIndex = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;
let hasMoved = false;

const DRAG_THRESHOLD = 5;   // movement to be considered a drag
const SWIPE_THRESHOLD = 50; // movement to change slides

function setPosition() {
  slides.style.transition = "transform 0.3s ease";
  slides.style.transform = `translateX(${-currentIndex * 100}%)`;
}

slides.addEventListener('pointerdown', (e) => {
  startX = e.clientX;
  isDragging = true;
  hasMoved = false;
  slides.style.transition = "none";
});

slides.addEventListener('touchstart', (e) => {
	console.log("touchstart");
	startX = e.touches[0].clientX;
	isDragging = true;
	hasMoved = false;
	slides.style.transition = "none";
});

slides.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const diff = e.clientX - startX;

  // Detect real drag (ignore tiny jitter)
  if (Math.abs(diff) > DRAG_THRESHOLD) {
    hasMoved = true;
  }

  if (!hasMoved) return;

  currentTranslate = -currentIndex * slides.offsetWidth + diff;
  slides.style.transform = `translateX(${currentTranslate}px)`;
});

slides.addEventListener('touchmove', (e) => {
	console.log("touchmove");
	if (!isDragging) return;
	
	const diff = e.touches[0].clientX - startX;
	
	// Detect real drag (ignore tiny jitter)
	if (Math.abs(diff) > DRAG_THRESHOLD) {
		hasMoved = true;
	}
	
	if (!hasMoved) return;
	
	currentTranslate = -currentIndex * slides.offsetWidth + diff;
	slides.style.transform = `translateX(${currentTranslate}px)`;
});

slides.addEventListener('pointerup', (e) => {
  if (!isDragging) return;

  isDragging = false;

  const diff = e.clientX - startX;

  if (Math.abs(diff) < DRAG_THRESHOLD) {
		if(e.clientX < window.innerWidth / 16 && currentIndex > 0) {
			currentIndex--;
		} else if (e.clientX > window.innerWidth - (window.innerWidth / 16) && currentIndex < slideCount - 1) {
			currentIndex++;
		}

    setPosition();
    return;
  }

  if (diff < -SWIPE_THRESHOLD && currentIndex < slideCount - 1) {
    currentIndex++;
  }

  if (diff > SWIPE_THRESHOLD && currentIndex > 0) {
    currentIndex--;
  }

  setPosition();
});

slides.addEventListener('touchend', (e) => {
	console.log("touchend");
	if (!isDragging) return;

  isDragging = false;

  const diff = e.changedTouches[0].clientX - startX;

  if (Math.abs(diff) < DRAG_THRESHOLD) {
		if(e.changedTouches[0].clientX < window.innerWidth / 16 && currentIndex > 0) {
			currentIndex--;
		} else if (e.changedTouches[0].clientX > window.innerWidth - (window.innerWidth / 16) && currentIndex < slideCount - 1) {
			currentIndex++;
		}

    setPosition();
    return;
  }

  if (diff < -SWIPE_THRESHOLD && currentIndex < slideCount - 1) {
    currentIndex++;
  }

  if (diff > SWIPE_THRESHOLD && currentIndex > 0) {
    currentIndex--;
  }

  setPosition();
});

slides.addEventListener('click', (e) => {
  if (hasMoved) {
    //e.preventDefault();
    //e.stopPropagation();
  }
});

// const slides = document.querySelector('.slides');
// const slideCount = document.querySelectorAll('.slide').length;

// let currentIndex = 0;
// let startX = 0;
// let currentTranslate = 0;
// let isDragging = false;

// function setPosition() {
//   slides.style.transition = "transform 0.3s ease";
//   slides.style.transform = `translateX(${-currentIndex * 100}%)`;
// }

// slides.addEventListener('pointerdown', (e) => {
//   startX = e.clientX;
//   isDragging = true;
//   slides.style.transition = "none";
// });

// slides.addEventListener('pointermove', (e) => {
//   if (!isDragging) return;

//   const diff = e.clientX - startX;
//   currentTranslate = -currentIndex * slides.offsetWidth + diff;
//   slides.style.transform = `translateX(${currentTranslate}px)`;
// });

// slides.addEventListener('pointerup', (e) => {
//   if (!isDragging) return;
//   isDragging = false;

//   const movedBy = currentTranslate + currentIndex * slides.offsetWidth;

// 	console.log(movedBy);
// 	// if(movedBy > -20 && movedBy < 20) {
// 	// 	return;
// 	// }

// 	if (movedBy < -50 && currentIndex < slideCount - 1) {
// 		currentIndex++;
// 	}

// 	if (movedBy > 50 && currentIndex > 0) {
// 		currentIndex--;
// 	}

//   setPosition();
// });


document.getElementById("user-agent").textContent = "User Agent: " + navigator.userAgent;
document.getElementById("device-type").textContent = "Touch Type: " + (mobileTouch() ? "Mobile/Tablet" : "Desktop");