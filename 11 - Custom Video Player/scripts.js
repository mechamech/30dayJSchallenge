const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.fullscreen');

function togglePlay() {
	video.paused ? video.play() : video.pause();
}

function updateButton() {
	this.paused ? toggle.textContent = '►' : toggle.textContent = '❚ ❚';
}

function skip() {
	video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
	video[this.name] = this.value;
	let button = document.querySelector(`button[name=${this.name}]`);
	if (this.name === 'volume') {
		button.textContent = `${this.value * 100}%`;
	}

	else if (this.name === 'playbackRate') {
		button.textContent = `${this.value}x`
	}
}

function handleProgress() {
	const progressPercent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${progressPercent}%`;
}

function scrub(event) {
	const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
}

function enterFullscreen() {
  if(video.requestFullscreen) {
    video.requestFullscreen();
  } else if(video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if(video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if(video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(btn => btn.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseleave', () => mousedown = false);

fullscreenButton.addEventListener('click', enterFullscreen);

