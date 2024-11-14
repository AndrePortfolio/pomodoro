// Set the initial time to 25 minutes
let timerMinutes = 25;
let timerSeconds = 0;
let timerRunning = false;
let timerInterval;

// Function to change time on button click
function changeTime(minutes)
{
	timerMinutes += minutes;

	// Ensure timer doesn't go below 0 minutes
	if (timerMinutes < 0)
		timerMinutes = 0;

	// Update the displayed timer in MM:SS format
	updateTimerDisplay();
}

// Start the timer display
function startTime()
{
	if (!timerRunning)
	{
		timerInterval = setInterval(decrementTime, 1000);
		timerRunning = true;
	}
}

// Pause the timer display
function pauseTime()
{
	if (timerRunning)
	{
		clearInterval(timerInterval); // Stop the timer interval
		timerRunning = false;
	}
}

// Stop the timer display
function stopTime()
{
	clearInterval(timerInterval);
	timerRunning = false;
	timerMinutes = 25;
	timerSeconds = 0;
	updateTimerDisplay();
}

// Decrement the time by 1 second
function decrementTime()
{
	if (timerSeconds === 0)
	{
		if (timerMinutes === 0)
		{
			clearInterval(timerInterval);
			timerRunning = false;
			alert("Session Complete!");
			return;
		}
		timerMinutes--;
		timerSeconds = 59;
	}
	else
		timerSeconds--;

	updateTimerDisplay();
}

// Update the timer display
function updateTimerDisplay()
{
	const timerElement = document.getElementById('timer');

	// Format the minutes and seconds to be two digits (e.g., "09:00")
	const minutesString = timerMinutes < 10 ? '0' + timerMinutes : timerMinutes;
	const secondsString = timerSeconds < 10 ? '0' + timerSeconds : timerSeconds;

	// Update the innerText of the timer element
	timerElement.innerText = `${minutesString}:${secondsString}`;
}

// Initialize the timer display on page load
window.onload = function()
{
	updateTimerDisplay();
};
