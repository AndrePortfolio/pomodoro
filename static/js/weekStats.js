// Get the current date
const currentDate = new Date();

// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const currentDay = currentDate.getDay();

// Calculate the start of the week (Monday)
const startOfWeek = new Date(currentDate);
startOfWeek.setDate(currentDate.getDate() - currentDay + 1); // Adjust for Monday (set to the previous Monday)
startOfWeek.setHours(0, 0, 0, 0); // Set the time to midnight

// Calculate the end of the week (Sunday)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday is 6 days after Monday
endOfWeek.setHours(23, 59, 59, 999); // Set the time to 11:59:59 PM

// Format the dates as 'Day X' (e.g., 'Day 18')
const formatDate = (date) => `Day ${date.getDate()}`;

// Set the dynamic title text
const titleText = [
	'This Week Focused time',
	`( ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)} )`
];

function groupSessionsByDay(weekData) {
	const sessionsByDay = {};

	weekData.forEach(session => {
		const date = new Date(session.timestamp);
		const day = date.toISOString().split('T')[0];

		if (!sessionsByDay[day]) {
			sessionsByDay[day] = 0;
		}
		sessionsByDay[day] += session.session_time;
	});

	// Convert the total seconds into hours with precision
	const dailySessionsInHours = Object.keys(sessionsByDay).map(day => {
		return sessionsByDay[day] / 3600; // Convert seconds to fractional hours
	});

	return dailySessionsInHours;
}

// Call the function and store the result
const dailySessionsInHours = groupSessionsByDay(weekData);

// Calculate the average hours worked in the month
const totalHours = dailySessionsInHours.reduce((sum, value) => sum + value, 0); // Sum all session hours
const averageHours = totalHours / dailySessionsInHours.length; // Calculate the average
const targetAverageHours = 6;

// Chart for weekly work
const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
	type: 'bar',
	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [{
			data: dailySessionsInHours, // Fractional hours
			backgroundColor: 'rgba(153, 102, 255, 0.2)',
			borderColor: 'rgba(153, 102, 255, 1)',
			borderWidth: 1
		}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			title: {
				display: true,
				text: titleText,
				position: 'top',
				padding: {
					bottom: 30
				}
			},
			tooltip: {
				callbacks: {
					label: function(tooltipItem) {
						// Get the total session time for the given day (fractional hours)
						const totalHours = dailySessionsInHours[tooltipItem.dataIndex];

						// Format the time as "X hours Y minutes"
						const hours = Math.floor(totalHours);
						const minutes = Math.round((totalHours % 1) * 60);

						return `${hours}h ${minutes}m`;
					}
				}
			},
			legend: {
				display: true, // Show the legend
				labels: {
					// Custom filtering function to exclude the bar dataset from the legend
					filter: function(legendItem, chartData) {
						// Exclude the bars dataset (the first one)
						return legendItem.datasetIndex !== 0;
					},
					generateLabels: function(chart) {
						const original = Chart.defaults.plugins.legend.labels.generateLabels;
						const labels = original(chart);

						// Add a custom label for the target average line
						labels.push({
							text: `Target Average Hours`,
							fillStyle: 'green', // The color of the target average line
							lineWidth: 2,
							strokeStyle: 'green',
							pointStyle: 'line',
							hidden: false
						});
						// Add a custom label for the average line
						labels.push({
							text: 'Average Hours Worked',
							fillStyle: 'red', // The color of the average line
							lineWidth: 2,
							strokeStyle: 'red',
							pointStyle: 'line',
							hidden: false
						});
						return labels;
					},
					usePointStyle: true,
				},
				position: 'bottom',
				align: 'center',
			},
			annotation: {
				annotations: [
					{
						type: 'line',
						yMin: averageHours,
						yMax: averageHours,
						borderColor: 'red',
						borderWidth: 1,
						label: {
							content: `Average: ${averageHours.toFixed(2)}h`,
							position: 'center',
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							font: {
								size: 10
							}
						}
					},
					{
						type: 'line',
						yMin: targetAverageHours,
						yMax: targetAverageHours,
						borderColor: 'green',
						borderWidth: 2,
						label: {
							content: `Target Average: ${targetAverageHours.toFixed(2)}h`,
							position: 'center',
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							font: {
								size: 10
							}
						}
					}
				]
			}
		},
		scales: {
			x: {
				ticks: {
					font: {
						size: 12
					}
				}
			},
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 1,
					callback: function(value) {
						return `${value}h`;
					}
				}
			}
		}
	}
});

