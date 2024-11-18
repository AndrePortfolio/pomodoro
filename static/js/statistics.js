monthSessions = monthData.map(session => session.session_time);
yearSessions = yearData.map(session => session.session_time);

console.log(dayData.map(session => session.session_time));
console.log(weekData.map(session => session.session_time));
console.log(monthData.map(session => session.session_time));
console.log(yearData.map(session => session.session_time));

// Array to store timeline data (working and non-working periods)
const timelineSegments = [];

// Constants for the day
const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_AN_HOUR = 3600;
const SLEEP_START = 23 * SECONDS_IN_AN_HOUR;
const SLEEP_END = 7 * SECONDS_IN_AN_HOUR;
const DEGREE_PER_SECOND = 360 / SECONDS_IN_A_DAY;

// Convert timestamp to Unix timestamp (seconds)
function convertToUnixTimestamp(timestamp)
{
	const date = new Date(timestamp);
	return Math.floor(date.getTime() / 1000); // Convert to seconds
}

// Sort sessions by timestamp to ensure proper sequence
dayData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Start tracking from midnight (0 seconds)
let lastEnd = 0;

// Loop through each session
dayData.forEach((session) => {
	const startTime = convertToUnixTimestamp(session.timestamp) % SECONDS_IN_A_DAY;
	const finishTime = startTime + session.session_time;

	// Add sleep and non-working segment at the beginning of the day
	if (lastEnd === 0 && startTime > SLEEP_END) {
		if (SLEEP_START > 0 && (SLEEP_START < SLEEP_END))
		{
			// Add not-working segment
			timelineSegments.push({
				degrees: SLEEP_START * DEGREE_PER_SECOND,
				color: 'rgba(200, 200, 200, 0.3)' // Sleep color
			});
			// Add sleep segment
			timelineSegments.push({
				degrees: (SLEEP_END - SLEEP_START) * DEGREE_PER_SECOND,
				color: 'rgba(128, 0, 128, 0.5)' // Sleep color
			});
		}
		else
		{
			// Add sleep segment
			timelineSegments.push({
				degrees: SLEEP_END * DEGREE_PER_SECOND,
				color: 'rgba(128, 0, 128, 0.5)' // Sleep color
			});
		}
		// Add non-working segment after sleep
		timelineSegments.push({
			degrees: (startTime - SLEEP_END) * DEGREE_PER_SECOND,
			color: 'rgba(200, 200, 200, 0.3)' // Non-working color
		});
	}
	else if (startTime > lastEnd) {
		// Add non-working segment if there is a gap
		timelineSegments.push({
			degrees: (startTime - lastEnd) * DEGREE_PER_SECOND,
			color: 'rgba(200, 200, 200, 0.3)' // Non-working color
		});
	}
	// Add the working segment
	timelineSegments.push({
		degrees: session.session_time * DEGREE_PER_SECOND,
		color: 'rgba(75, 192, 192, 1)' // Working color
	});

	// Update the last end time
	lastEnd = finishTime
});

if (SLEEP_START > SLEEP_END)
{
	// Add the final non-working segment if the last session doesn't end at midnight
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: (SLEEP_START - lastEnd) * DEGREE_PER_SECOND,
			color: 'rgba(200, 200, 200, 0.3)' // Non-working color
		});
	}
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: (SECONDS_IN_A_DAY - SLEEP_START) * DEGREE_PER_SECOND,
			color: 'rgba(128, 0, 128, 0.5)' // Sleep color
		});
	}
}
else
{
	// Add the final non-working segment if the last session doesn't end at midnight
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: (SECONDS_IN_A_DAY - lastEnd) * DEGREE_PER_SECOND,
			color: 'rgba(200, 200, 200, 0.3)' // Non-working color
		});
	}
}

const afterDrawPlugin = {
	id: 'afterDrawPlugin', // Unique ID for the plugin
	afterDraw: function(chart) {
		if (chart.canvas.id !== 'dailyChart') return;
		const ctx = chart.ctx;

		// Calculate the center of the chart (pie)
		const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
		const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

		// Calculate the radius using the minimum of the width or height of the chart area
		const radius = Math.min(
			(chart.chartArea.right - chart.chartArea.left) / 2,
			(chart.chartArea.bottom - chart.chartArea.top) / 2
		) + 20;

		// Set the style for the text
		ctx.font = '14px Arial';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Hours to display and their corresponding angles in radians
		const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
		const positions = [
			-Math.PI / 2,		// 00:00
			-Math.PI / 4,		// 03:00
			0,					// 06:00
			Math.PI / 4,		// 09:00
			Math.PI / 2,		// 12:00
			3 * Math.PI / 4,	// 15:00
			Math.PI,			// 18:00
			-3 * Math.PI / 4,	// 21:00
		];
		// Loop through each hour and place it at the correct angle
		hours.forEach((hour, index) => {
			let currentRadius = radius;  // Start with the default radius

			// Adjust radius for '00:00' and '12:00' (move them closer)
			if (hour === '00:00' || hour === '12:00')
				currentRadius -= 10;

			const angle = positions[index];
			const x = centerX + Math.cos(angle) * currentRadius;
			const y = centerY + Math.sin(angle) * currentRadius;

			// Draw the hour label at the calculated position
			ctx.fillText(hour, x, y);

			// Calculate the starting point of the line (3/4 of the way to the outer edge)
			let		lineStartRadius = 0; // Start 3/4 of the way
			const	lineEndRadius = radius - 21; // End at the outer edge

			if (hour === '00:00' || hour === '12:00' || hour === '06:00' || hour === '18:00')
				lineStartRadius = 0;  // Increase radius for these hours

			// Calculate the start and end coordinates for the line
			const xStart = centerX + Math.cos(angle) * lineStartRadius;
			const yStart = centerY + Math.sin(angle) * lineStartRadius;

			const xEnd = centerX + Math.cos(angle) * lineEndRadius;
			const yEnd = centerY + Math.sin(angle) * lineEndRadius;

			// Draw a line from the center to the edge (clock-like)
			ctx.beginPath();
			ctx.moveTo(xStart, yStart);  // Start at 3/4 of the way
			ctx.lineTo(xEnd, yEnd);  // End at the edge (outer radius)
			ctx.strokeStyle = 'black';  // Set the color of the line
			ctx.lineWidth = 0.2;  // Set the width of the line
			ctx.stroke();  // Draw the line
		});
	}
};

// Register the custom plugin in Chart.js
Chart.register(afterDrawPlugin);

// Define the colors to labels mapping
const colorToLabel = {
	'rgba(128, 0, 128, 0.5)': 'Sleep', // Sleep color
	'rgba(200, 200, 200, 0.3)': 'Free Time', // Non-working color
	'rgba(75, 192, 192, 1)': 'Working Sessions' // Working color
};

// Map the timelineSegments colors to labels
const uniqueLabels = [...new Set(timelineSegments.map(segment => colorToLabel[segment.color] || 'Unknown'))];

const dailyChart = new Chart(document.getElementById('dailyChart'), {
	type: 'pie',
	data: {
		labels: uniqueLabels,
		datasets: [{
			data: timelineSegments.map(segment => segment.degrees),
			backgroundColor: timelineSegments.map(segment => segment.color),
			borderColor: 'rgba(255, 255, 255, 0.5)',
			borderWidth: 1
		}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: true, // Ensures the chart stays circular
		plugins: {
			title: {
				display: true,
				text: 'Today\' Work Sessions',
				position: 'top',
				padding: {
					bottom: 30 // Adds a little padding at the bottom for spacing
				}
			},
			tooltip: {
				callbacks: {
					// Custom tooltip label function
					label: function(tooltipItem) {
						const segment = timelineSegments[tooltipItem.dataIndex]; // Get the corresponding segment
						const totalSeconds = segment.degrees / DEGREE_PER_SECOND; // Convert degrees to seconds
						const hours = Math.floor(totalSeconds / 3600); // Get the full hours
						const minutes = Math.floor((totalSeconds % 3600) / 60); // Get the remaining minutes

						// Format the time as "X hours Y minutes"
						const formattedTime = `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;

						return `${colorToLabel[segment.color]}: ${formattedTime}`;
					}
				}
			},
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					boxWidth: 20,
					padding: 30,
					// Ensure the legends fit on the same row
					usePointStyle: true, // Makes the legend items circular
					// Adjust the width of the label container to make sure they fit in one row
					maxWidth: 200
				},
				// Make sure the legend items are displayed in a row
				align: 'center', // Centers the legends
				reverse: false,  // Do not reverse the order of legends
				fullWidth: true
			}
		},
	}
});

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

// which sessions happened on the same day, and group them by days.
// Then, once you have the groups, you check inside of them for the sessions,
// and sum the session times. Giving you a total amount worked on that day.

// // Function to group sessions by day and calculate total session time in hours
// function groupSessionsByDay(weekData) {
// 	// Group sessions by day (using the date part of the timestamp)
// 	weekSessions.forEach(session) => {
// 		const date = new Date(session.timestamp);

// 		const day = date.getDate();

// 	}

// 	return dailySessionsInHours;  // Return an array with the total hours per day
// }

// Call the function and store the result
const dailySessionsInHours = groupSessionsByDay(weekData);

// Log the result
console.log(dailySessionsInHours);

// Chart for weekly work
const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
	type: 'bar',
	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [{
			label: 'Hours Worked (Daily)',
			data: dailySessionsInHours,
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
					bottom: 30 // Adds a little padding at the bottom for spacing
				}
			},
			tooltip: {
				callbacks: {
					// Custom tooltip label function
					label: function(tooltipItem) {
						// Get the index of the item in the dataset
						const index = tooltipItem.dataIndex;

						// Access the original time in seconds
						const sessionTimeInSeconds = weekSessions[index];

						// Convert the session time to hours and minutes
						const hours = Math.floor(sessionTimeInSeconds / 3600);
						const minutes = Math.floor((sessionTimeInSeconds % 3600) / 60);

						// Format the time as "X hours Y minutes"
						const formattedTime = `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;

						return formattedTime;
					}
				}
			},
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					usePointStyle: true
				},
				// Make sure the legend items are displayed in a row
				align: 'center', // Centers the legends
				fullWidth: true
			}
		},
		scales: {
			y: {
				min: 0,   // Ensure the y-axis starts from 0
				max: 12,  // Set the maximum value to 16 hours
				stepSize: 2,  // Control the step size (interval between ticks on the y-axis)
				ticks: {
					beginAtZero: true  // Ensures the y-axis always starts from 0
				}
			}
		}
	}
});



// Chart for monthly work
const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
	type: 'line',
	data: {
		labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
		datasets: [{
			label: 'Hours Worked (Monthly)',
			data: monthSessions,
			fill: false,
			borderColor: 'rgba(54, 162, 235, 1)',
			tension: 0.1
		}]
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Monthly Work Statistics'
			}
		}
	}
});

// Chart for yearly work
const yearlyChart = new Chart(document.getElementById('yearlyChart'), {
	type: 'bar',
	data: {
		labels: ['January', 'February', 'March'],
		datasets: [{
			label: 'Hours Worked (Yearly)',
			data: yearSessions,
			backgroundColor: 'rgba(255, 159, 64, 0.2)',
			borderColor: 'rgba(255, 159, 64, 1)',
			borderWidth: 1
		}]
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Yearly Work Statistics'
			}
		}
	}
});
