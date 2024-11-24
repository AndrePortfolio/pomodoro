const allDaysData = calendarData.map(month => month.days_data);

console.log(allDaysData);

document.addEventListener('DOMContentLoaded', function() {
	// Get all date elements
	const dates = document.querySelectorAll('.date');

	// Iterate over each date
	dates.forEach(function(dateElement) {
		// Get the work hours from the data attribute
		const workInSeconds = parseInt(dateElement.getAttribute('data-work-hours'), 10);
		const workHours = workInSeconds / 3600;

		// console.log(workHours)
		let		opacity = 0;
		const	factor = 0.08;

		console.log(workHours)

		if (workHours > 0) {
			const multiplier = Math.min(Math.floor(workHours), 10);
			opacity = factor * (multiplier + 1);
		}

		// Apply a red background with calculated opacity
		dateElement.style.backgroundColor = `rgba(7, 36, 124, ${opacity})`;

		// Optionally, change the text color based on the amount of work done
		if (workHours > 5) {
			dateElement.style.color = 'white';  // Make text white for highly worked days
		}

	});
});
