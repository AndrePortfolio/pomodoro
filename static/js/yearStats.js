// Map session times (convert seconds to hours)
const yearSessions = yearData.map(session => session.session_time / 3600); // Convert to hours

// Get the current year
const now = new Date();
const currentYear = now.getFullYear();

// Filter data for the current year
const filteredYearData = yearData.filter(session => {
	const sessionDate = new Date(session.timestamp); // Assuming `session.date` is a valid date string
	return sessionDate.getFullYear() === currentYear;
});

// Monthly aggregation
const monthsInYear = 12; // Number of months in a year
const months = new Array(monthsInYear).fill(0); // Initialize an array to hold the session time for each month

filteredYearData.forEach(session => {
	const sessionDate = new Date(session.timestamp);
	const month = sessionDate.getMonth(); // Get the month (0 to 11)
	months[month] += session.session_time / 3600; // Convert session time to hours and add it to the corresponding month
});

// Calculate the average hours worked in the year
const totalHours = months.reduce((sum, value) => sum + value, 0); // Sum all session hours
const averageHours = totalHours / monthsInYear; // Calculate the average
const targetAverageHours = 80; // Set target average hours per month

const yearlyChart = new Chart(document.getElementById('yearlyChart'), {
	type: 'bar',
	data: {
		labels: Array.from({ length: monthsInYear }, (_, i) => `${new Date(0, i).toLocaleString('default', { month: 'long' })}`), // Labels for months
		datasets: [{
			data: months,
			backgroundColor: 'rgba(54, 162, 235, 0.5)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1,
		}],
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: `${currentYear} Focused time`
			},
			tooltip: {
				callbacks: {
					label: function(tooltipItem) {
						// Get the total session time for the given month (fractional hours)
						const totalHours = months[tooltipItem.dataIndex];

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
							content: `Average: ${averageHours.toFixed(2)}h`, // Label for the line
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
					autoSkip: false,
					maxRotation: 0,
					minRotation: 0,
					font: {
						size: 10
					}
				}
			},
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 10,
					callback: function(value) {
						return `${value}h`;
					}
				}
			}
		}
	}
});
