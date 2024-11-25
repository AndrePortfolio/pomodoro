const allDaysData = calendarData.map(month => month.days_data);

document.addEventListener('DOMContentLoaded', function() {
	// Get all date elements
	const dates = document.querySelectorAll('.date');

	// Iterate over each date
	dates.forEach(function(dateElement) {
		// Get the work hours from the data attribute
		const workInSeconds = parseInt(dateElement.getAttribute('data-work-hours'), 10);
		const workHours = Math.floor(workInSeconds / 3600);
		const workMinutes = Math.floor((workInSeconds % 3600) / 60);
		const tooltipText = `${workHours} hours ${workMinutes} minutes`;

		let		opacity = 0;
		const	factor = 0.08;

		if (workHours > 0) {
			const multiplier = Math.min(Math.floor(workHours), 10);
			opacity = factor * (multiplier + 1);
			dateElement.style.backgroundColor = `rgba(7, 36, 124, ${opacity})`;
		}
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
