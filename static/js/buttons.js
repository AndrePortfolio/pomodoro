// Set the initial time to 25 minutes (1500 sec)
let timerSeconds = 1500;
let timerRunning = false;
let sessionRunning = false;
let timerInterval;
let sessionLength = 0;
const tickTockSound = document.getElementById("ticktac-sound");

// Function to change time on button click
function changeTime(seconds)
{
	timerSeconds += (seconds * 60);
	sessionLength += (seconds * 60);
	
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
		tickTockSound.play();
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
		tickTockSound.pause();
		tickTockSound.currentTime = 0;
		clearInterval(timerInterval); // Stop the timer interval
		timerRunning = false;
	}
}

// Stop the timer display
function stopTime()
{
	if (sessionRunning) {
		// Show the confirmation modal
		const confirmationModal = document.getElementById('confirmationModal');
		confirmationModal.style.display = 'flex';

		// Get the confirm and cancel buttons
		const confirmButton = document.getElementById('confirmButton');
		const cancelButton = document.getElementById('cancelButton');

		// Store the target URL (link clicked) to navigate to after confirmation
		const targetUrl = event.target.href;

		// Confirm action
		confirmButton.onclick = function() {
			tickTockSound.pause();
			tickTockSound.currentTime = 0;
			saveSessionTime();
			confirmationModal.style.display = 'none'; // Hide the modal after confirmation

			// Now proceed with the navigation
			if (targetUrl)
				window.location.href = targetUrl;
		};

		// Cancel action
		cancelButton.onclick = function() {
			confirmationModal.style.display = 'none'; // Hide the modal if canceled
		};

		// Prevent the link's default action to allow showing the modal first
		event.preventDefault();
	}
}

// Add event listeners to the navbar links
document.addEventListener('DOMContentLoaded', function() {
	const navbarLinks = document.querySelectorAll('.navbar-nav a');

	navbarLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			if (sessionRunning) {
				stopTime.call(link, event); // Call stopTime if a session is running
			}
		});
	});
});

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
		updateTimerDisplay();
	}
}

// Initialize the timer display on page load
window.onload = function()
{
	updateTimerDisplay();
};
