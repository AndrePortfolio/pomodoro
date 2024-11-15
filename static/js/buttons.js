// Set the initial time to 25 minutes (1500 sec)
let timerSeconds = 1500;
let timerRunning = false;
let sessionRunning = false;
let timerInterval;
let sessionLength;

// Function to change time on button click
function changeTime(seconds)
{
	timerSeconds += (seconds * 60);

	// Ensure timer doesn't go below 0 minutes
	if (timerSeconds < 0)
		timerSeconds = 0;

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
		if (!sessionRunning)
		{
			sessionRunning = true;
			sessionLength = timerSeconds;
		}
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
	saveSessionTime();
}

// Decrement the time by 1 second
function decrementTime()
{
	if (timerSeconds === 0)
	{
		alert("Session Complete!");
		saveSessionTime();
		return;
	}
	else
		timerSeconds--;

	updateTimerDisplay();
}

// Update the timer display
function updateTimerDisplay()
{
	const	timerElement = document.getElementById('timer');
	let		timerMinutes = Math.floor(timerSeconds / 60);
	let		seconds = timerSeconds % 60;

	// Format the minutes and seconds to be two digits (e.g., "09:00")
	const	minutesString = timerMinutes < 10 ? '0' + timerMinutes : timerMinutes;
	const	secondsString = seconds < 10 ? '0' + seconds : seconds;

	// Update the innerText of the timer element
	timerElement.innerText = `${minutesString}:${secondsString}`;
}

// Function to send session time to the backend
function saveSessionTime()
{
	clearInterval(timerInterval);
	const sessionTime = sessionLength - timerSeconds;

	// Send a POST request to save the time in the database
	if (sessionTime)
	{
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

		timerRunning = false;
		sessionRunning = false;
		timerSeconds = 1500;
	}
}

// Initialize the timer display on page load
window.onload = function()
{
	updateTimerDisplay();
};
