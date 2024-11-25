// Map session times for all years in one step and convert seconds to hours
const allYearsSessions = yearsData.map(year =>
	year.map(session => session.session_time / 3600) // Convert seconds to hours
);

// Calculate the total session times for each year
const totalSessionsPerYear = allYearsSessions.map(yearData =>
	yearData.reduce((sum, session) => sum + session, 0) // Sum up session times for each year
);

// Get the distinct years with session data (filter out years with 0 sessions)
const distinctYears = totalSessionsPerYear
	.map((total, index) => total > 0 ? new Date().getFullYear() - (index) : null)
	.filter(year => year !== null); // Only keep years that have session data

// Ensure the current year is included if there's any data from previous years
const currentYear = new Date().getFullYear();

// Check if current year already exists
if (!distinctYears.includes(currentYear)) {
	// Check if there's any data for other years (only add current year if there's data for other years)
	if (totalSessionsPerYear.some(total => total > 0)) {
		// If there's other session data, add current year with zero session time
		distinctYears.push(currentYear);
		totalSessionsPerYear.push(0);
	}
}

// Filter out the session data corresponding to years with no data, but keep the current year if it has no data
const filteredSessions = totalSessionsPerYear.filter(total => total > 0 || total === 0);

// Create year labels from the distinct years
const yearLabels = distinctYears.map(year => year.toString()); // Use distinct years, including the current year

// Create the chart
const yearsChart = new Chart(document.getElementById('yearsChart'), {
	type: 'bar',
	data: {
		labels: yearLabels, // Use only the years with session data
		datasets: [{
			label: 'Total Focused Time (Hours)',
			data: filteredSessions, // Use the filtered session data
			backgroundColor: 'rgba(7, 36, 124, 0.6)',
			borderWidth: 1,
		}],
	},
	options: {
		responsive: true,
		aspectRatio: 1.7,
		plugins: {
			title: {
				font: {
					size: 15,
				},
				display: true,
				text: 'Total Focused Time per Year',
			},
			tooltip: {
				callbacks: {
					label: function(tooltipItem) {
						const totalHours = tooltipItem.raw; // Value of the bar (in hours)
						const hours = Math.floor(totalHours);
						const minutes = Math.round((totalHours % 1) * 60); // Convert decimal to minutes
						return `${hours}h ${minutes}m`;
					},
				},
			},
			legend: {
				display: false, // Disable legend as there's only one dataset
			},
		},
		scales: {
			x: {
				reverse: true, // This reverses the x-axis order
				ticks: {
					color: 'black',
					font: {
						size: 12,
					},
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 20,
					callback: function(value) {
						return `${value}h`; // Display values as hours
					},
				},
			},
		},
	},
});
