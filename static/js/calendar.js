const monthsData = calendarData.map(month => month.days_data);

document.addEventListener('DOMContentLoaded', function() {
	// Get all date elements
	const dates = document.querySelectorAll('.date');

	monthsData.forEach(function(monthData, index) {
		// Calculate the total seconds for the month
		let totalSeconds = 0;

		monthData.forEach(function(day) {
			// Check if sessions exist and are an array
			if (Array.isArray(day.sessions)) {
				// Sum the durations of all sessions for that day
				const dayTotalSeconds = day.sessions.reduce(function(acc, session) {
					return acc + session; // Add each session duration to the accumulator
				}, 0);

				totalSeconds += dayTotalSeconds; // Add the total seconds for the day to the month total
			} else {
				console.error('Sessions data is not an array:', day.sessions);
			}
		});

		const totalHours = totalSeconds / 3600; // Convert seconds to hours
		const hours = Math.floor(totalHours); // Get the whole hours (integer part)
		const minutes = Math.floor((totalHours - hours) * 60); // Convert decimal to minutes and round

		// Format into hh:mm
		const formattedTime = `${hours}h${minutes.toString().padStart(2, '0')}`; // Ensure minutes are always two digits

		// Get the corresponding month element in the DOM
		const monthElement = document.querySelectorAll('.calendar-header .month-year')[index];

		// Check if the element exists
		if (monthElement)
			monthElement.innerHTML = `${monthElement.innerHTML} <span class="month-total-time">(${formattedTime})</span>`;
	});


	// Iterate over each date
	dates.forEach(function(dateElement) {
		// Get the work hours from the data attribute
		const workInSeconds = parseInt(dateElement.getAttribute('data-work-hours'), 10);
		const workHours = Math.floor(workInSeconds / 3600);
		const workMinutes = Math.floor((workInSeconds % 3600) / 60);
		const tooltipText = `${workHours}h${String(workMinutes).padStart(2, '0')}`;

		let		opacity = 0;
		const	factor = 0.08;

		if (workHours > 0) {
			const multiplier = Math.min(Math.floor(workHours), 10);
			opacity = factor * (multiplier + 1);
			dateElement.style.backgroundColor = `rgba(7, 36, 124, ${opacity})`;
		}
		else if (workInSeconds > 0)
			dateElement.style.backgroundColor = `rgba(7, 36, 124, ${factor / 2})`;
		if (workHours > 5)
			dateElement.style.color = 'white';  // Make text white for highly worked days

		// Add event listeners for hover effects
		dateElement.addEventListener('mouseenter', function () {
			const tooltip = document.createElement('div');
			tooltip.className = 'tooltip';
			tooltip.textContent = tooltipText;
			dateElement.appendChild(tooltip);

			// Position the tooltip
			const rect = dateElement.getBoundingClientRect();
			tooltip.style.left = `${rect.width / 2 - tooltip.offsetWidth / 2}px`;
			tooltip.style.top = `${-tooltip.offsetHeight - 5}px`;

			// Make the tooltip visible
			setTimeout(() => (tooltip.style.opacity = '1'), 0);
		});

		dateElement.addEventListener('mouseleave', function () {
			const tooltip = dateElement.querySelector('.tooltip');
			if (tooltip) {
				tooltip.remove();
			}
		});
	});
});
