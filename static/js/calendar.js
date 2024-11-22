document.addEventListener('DOMContentLoaded', function() {
	// Get all date elements
	const dates = document.querySelectorAll('.date');

	// Iterate over each date
	dates.forEach(function(dateElement) {
		// Get the work hours from the data attribute
		const workHours = parseInt(dateElement.getAttribute('data-work-hours'), 10);

		// Calculate the opacity based on work hours
		let opacity = 0.1; // Default opacity for no work

		if (workHours > 0 && workHours <= 1) {
			opacity = 0.1;  // Light red for low work
		} else if (workHours > 1 && workHours <= 3) {
			opacity = 0.3;  // Moderate red for moderate work
		} else if (workHours > 3 && workHours <= 5) {
			opacity = 0.5;  // Stronger red for more work
		} else if (workHours > 5 && workHours <= 8) {
			opacity = 0.7;  // Deep red for high work
		} else if (workHours > 8) {
			opacity = 0.9;  // Very deep red for very high work
		}

		// Apply a red background with calculated opacity
		dateElement.style.backgroundColor = `rgba(255, 0, 0, ${opacity})`;

		// Optionally, change the text color based on the amount of work done
		if (workHours > 5) {
			dateElement.style.color = 'white';  // Make text white for highly worked days
		}
	});
});
