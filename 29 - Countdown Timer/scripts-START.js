let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const minutesInput = document.customForm;
const body = document.body;

function timer(seconds) {
	clearInterval(countdown);
	const now = Date.now();
	const future = now + seconds * 1000;
	body.classList.add('timer-on');
	body.style.setProperty('transition-duration', `${seconds}s`)
	displayTimeLeft(seconds);
	displayEndTime(future);

	countdown = setInterval(() => {
		const secondsLeft = Math.round((future - Date.now()) / 1000);
		if (secondsLeft === 0) { endTime.textContent = "Aaand we're back!" }
		else if (secondsLeft < 0) {
			clearInterval(countdown);
			return;
		}
		displayTimeLeft(secondsLeft);
	}, 1000);
}

function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainderSeconds = seconds % 60;
	const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
	document.title = timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
	const end = new Date(timestamp);
	const hour = end.getHours();
	const minutes = end.getMinutes();
	endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function handleMinuteSubmit(e) {
	e.preventDefault();
	const minutes = this.minutes.value;
	timer(minutes * 60); 
}

buttons.forEach(button => button.addEventListener('click', (e) => {
	timer(e.target.getAttribute('data-time'))
}));
minutesInput.addEventListener('submit', handleMinuteSubmit);