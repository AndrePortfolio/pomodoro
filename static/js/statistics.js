weekSessions = weekData.map(session => session.session_time);
monthSessions = monthData.map(session => session.session_time);
yearSessions = yearData.map(session => session.session_time);

console.log(dayData.map(session => session.session_time));
console.log(weekData.map(session => session.session_time));
console.log(monthData.map(session => session.session_time));
console.log(yearData.map(session => session.session_time));

sessionFinish = dayData.map(session => session.timestamp);
todaySessions = dayData.map(session => session.session_time);

// Constants for the day
const SECONDS_IN_A_DAY = 86400;
const DEGREE_PER_SECOND = 360 / SECONDS_IN_A_DAY;

// Convert timestamp to Unix timestamp (seconds)
function convertToUnixTimestamp(timestamp)
{
	const date = new Date(timestamp);
	return Math.floor(date.getTime() / 1000); // Convert to seconds
}

// Array to store timeline data (working and non-working periods)
const timelineSegments = [];

// Sort sessions by timestamp to ensure proper sequence
dayData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Start tracking from midnight (0 seconds)
let lastEnd = 0; // Keeps track of the end of the last session

// Loop through each session
dayData.forEach((session) => {
	const startTime = convertToUnixTimestamp(session.timestamp) % SECONDS_IN_A_DAY;
	const finishTime = startTime + session.session_time;

	// Add a non-working segment if there is a gap
	if (startTime > lastEnd)
	{
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
	lastEnd = finishTime;
});

// Add the final non-working segment if the last session doesn't end at midnight
if (lastEnd < SECONDS_IN_A_DAY)
{
	timelineSegments.push({
		degrees: (SECONDS_IN_A_DAY - lastEnd) * DEGREE_PER_SECOND,
		color: 'rgba(200, 200, 200, 0.3)' // Non-working color
	});
}

const afterDrawPlugin = {
	id: 'afterDrawPlugin', // Unique ID for the plugin
	afterDraw: function(chart) {
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
			-3 * Math.PI / 4,	// 15:00
			Math.PI,			// 18:00
			3 * Math.PI / 4,	// 15:00
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
			let		lineStartRadius = radius * 0.75; // Start 3/4 of the way
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

// Debugging: Log the timeline segments
console.log(timelineSegments);

const dailyChart = new Chart(document.getElementById('dailyChart'), {
	type: 'pie',
		data: {
		datasets: [{
			data: timelineSegments.map(segment => segment.degrees),
			backgroundColor: timelineSegments.map(segment => segment.color),
			borderColor: 'rgba(255, 255, 255, 0.5)',
			borderWidth: 1
		}],
		labels: ['Free Time', 'Working Sessions']
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
				legend: {
					display: true,  // Displays the legend
					position: 'bottom',  // Positioning of the legend (default is 'top')
					labels: {
						boxWidth: 20,  // Size of the boxes next to the legend items
						padding: 30    // Space between legend labels
					},
				}
			},
		}
});




// Chart for weekly work
const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
	type: 'bar',
	data: {
		labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
		datasets: [{
			label: 'Hours Worked (Weekly)',
			data: weeklyData,
			backgroundColor: 'rgba(153, 102, 255, 0.2)',
			borderColor: 'rgba(153, 102, 255, 1)',
			borderWidth: 1
		}]
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Weekly Work Statistics'
			}
		}
	}
});

// Chart for monthly work
const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
	type: 'line',
	data: {
		labels: ['January', 'February', 'March', 'April'],
		datasets: [{
			label: 'Hours Worked (Monthly)',
			data: monthlyData,
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
		labels: ['2021', '2022', '2023'],
		datasets: [{
			label: 'Hours Worked (Yearly)',
			data: yearlyData,
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
