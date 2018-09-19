const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(localMediaStream => {
		video.srcObject = localMediaStream;
		video.play();
	})
	.catch(err => {
		console.error('plz give webcam access', err);
	})
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	requestAnimationFrame(drawPixels.bind(this, width, height));
}

function drawPixels(width, height) {
	ctx.drawImage(video, 0, 0, width, height);
	let pixels = ctx.getImageData(0, 0, width, height);
	//greenScreen(pixels);
	//redEffect(pixels);
	rgbSplit(pixels);

	// ghosty effect
	ctx.globalAlpha = 0.2;
	ctx.putImageData(pixels, 0, 0)
	requestAnimationFrame(drawPixels.bind(this, width, height))
}

function takePhoto() {
	//play sound
	snap.currentTime = 0;
	snap.play();
	//get canvas data
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'photo');
	link.innerHTML = `<img src='${data}' alt=':D'>`
	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for(let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i] += 100 // red
		pixels.data[i + 1] -= 50 // green
		pixels.data[i + 2] * .5 // blue
	}
}

function rgbSplit(pixels) {
	for(let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i - 150] = pixels.data[i] // red
		pixels.data[i + 100] = pixels.data[i + 1] // green
		pixels.data[i - 150] = pixels.data[i + 2] // blue
	}
}

function greenScreen(pixels) {
	const levels = {};

	document.querySelectorAll('.rgb input')
	.forEach(input => levels[input.name] = input.value)

	for (i = 0; i < pixels.data.length; i += 4) {
		red = pixels.data[i];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (red >= levels.rmin
			&& green >= levels.gmin
			&& blue >= levels.bmin
			&& red <= levels.rmax
			&& green <= levels.gmax
			&& blue <= levels.bmax)
			{
				pixels.data[i + 3] = 0;
		  }
	}
}

getVideo();

video.addEventListener('canplay', paintToCanvas);