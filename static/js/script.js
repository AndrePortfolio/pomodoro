let countdown;
let isTimerRunning = false;

document.getElementById('startButton').addEventListener('click', function()
{
	if (isTimerRunning)
	{
		// Stop the timer if it's already running
		clearInterval(countdown);
		document.getElementById('startButton').textContent = 'Start Timer';
		document.getElementById('status').textContent = '';
	}
	else
	{
		// Start the timer
		let minutes = document.getElementById('minutes').value;
		startTimer(minutes);
		document.getElementById('startButton').textContent = 'Pause Timer';
	}
});

function startTimer(duration)
{
	let timeInSeconds = duration * 60; // Convert minutes to seconds
	updateTimerDisplay(timeInSeconds);

	countdown = setInterval(function() {
		timeInSeconds--;
		updateTimerDisplay(timeInSeconds);

		// If the timer hits zero, stop the countdown
		if (timeInSeconds <= 0)
		{
			clearInterval(countdown);
			document.getElementById('status').textContent = 'Pomodoro Completed!';
		}
	}, 1000);

	isTimerRunning = true;
}

function updateTimerDisplay(seconds)
{
	const statusElement = document.getElementById("status");
	statusElement.textContent = "Time's up!";

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const displayTime = `${pad(minutes)}:${pad(remainingSeconds)}`;

	document.getElementById('timer').textContent = displayTime;
}

function pad(number)
{
	return number < 10 ? '0' + number : number;
}
