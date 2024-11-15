// Set the initial time to 25 minutes
let timerMinutes = 25;
let timerSeconds = 0;
let timerRunning = false;
let timerInterval;
let sessionLength;
let timeElapsed = 0;

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
		sessionLenght = timerMinutes;
	}
}

// Pause the timer display
function pauseTime()
{
	if (timerRunning)
	{
		clearInterval(timerInterval); // Stop the timer interval
		timerRunning = false;
		timeElapsed = (sessionLength * 60) - (timerMinutes * 60 + timerSeconds);
	}
}

// Stop the timer display
function stopTime()
{
	clearInterval(timerInterval);
	timerRunning = false;
	timeElapsed = (sessionLength * 60) - (timerMinutes * 60 + timerSeconds);
	timerMinutes = 25;
	timerSeconds = 0;
	updateTimerDisplay();
	saveSessionTime();
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
			saveSessionTime();
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

// Function to send session time to the backend
function saveSessionTime()
{
	const sessionTime = (sessionLength * 60) - timeElapsed;

	// Send a POST request to save the time in the database
	fetch("/save-session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			time: sessionTime
		})
	})
	.then(response => response.json())
	.then(data => {
		if (data.success)
			console.log("Session time saved successfully.");
		else
			console.log("Error saving session time.");
	})
	.catch(error => {
		console.error("Error:", error);
	});
}

// Initialize the timer display on page load
window.onload = function()
{
	updateTimerDisplay();
};
