const blurredLeaderboards = document.querySelectorAll('.blurred-leaderboard');
const prevBtn = document.querySelector('.prev-leaderboard');
const nextBtn = document.querySelector('.next-leaderboard');
let currentIndex = 0;

function showLeaderboard(index) {
	blurredLeaderboards.forEach((board, i) => {
		board.style.display = i === index ? 'block' : 'none';
	});
}

// Initialize URLSearchParams to read query string parameters
const urlParams = new URLSearchParams(window.location.search);

// Update index based on the action parameter
const action = urlParams.get('action');
if (action === 'prev')
	currentIndex = (currentIndex - 1 + blurredLeaderboards.length) % blurredLeaderboards.length;
else if (action === 'next')
	currentIndex = (currentIndex + 1) % blurredLeaderboards.length;

// Check if `timeframe` is empty and remove it from the URL
if (urlParams.has('timeframe') && !urlParams.get('timeframe')) {
	urlParams.delete('timeframe'); // Remove the empty `timeframe`
	// Update the URL without reloading the page
	window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
}

// Remove the action parameter from the URL after processing
urlParams.delete('action');
window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);

// Update the URL
const newQueryString = urlParams.toString();
const newUrl = newQueryString
	? `${window.location.pathname}?${newQueryString}`
	: window.location.pathname;

// Replace the current URL
window.history.replaceState(null, '', newUrl);
