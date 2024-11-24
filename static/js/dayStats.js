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
const chillColor = 'rgba(200, 200, 200, 0.3)'
const sleepColor = 'rgba(7, 36, 124, 0.6)'
const workColor = 'rgba(217, 57, 57, 0.6)'

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
				degrees: Math.round(SLEEP_START * DEGREE_PER_SECOND),
				color: chillColor
			});
			// Add sleep segment
			timelineSegments.push({
				degrees: Math.round((SLEEP_END - SLEEP_START) * DEGREE_PER_SECOND),
				color: sleepColor
			});
		}
		else
		{
			// Add sleep segment
			timelineSegments.push({
				degrees: Math.round(SLEEP_END * DEGREE_PER_SECOND),
				color: sleepColor
			});
		}
		// Add non-working segment after sleep
		timelineSegments.push({
			degrees: Math.round((startTime - SLEEP_END) * DEGREE_PER_SECOND),
			color: chillColor
		});
	}
	else if (startTime > lastEnd) {
		// Add non-working segment if there is a gap
		timelineSegments.push({
			degrees: Math.round((startTime - lastEnd) * DEGREE_PER_SECOND),
			color: chillColor
		});
	}
	// Add the working segment
	timelineSegments.push({
		degrees: Math.round(session.session_time * DEGREE_PER_SECOND),
		color: workColor
	});

	// Update the last end time
	lastEnd = finishTime
});

if (SLEEP_START > SLEEP_END)
{
	// Add the final non-working segment if the last session doesn't end at midnight
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: Math.round((SLEEP_START - lastEnd) * DEGREE_PER_SECOND),
			color: chillColor
		});
	}
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: Math.round((SECONDS_IN_A_DAY - SLEEP_START) * DEGREE_PER_SECOND),
			color: sleepColor
		});
	}
}
else
{
	// Add the final non-working segment if the last session doesn't end at midnight
	if (lastEnd < SECONDS_IN_A_DAY) {
		timelineSegments.push({
			degrees: Math.round((SECONDS_IN_A_DAY - lastEnd) * DEGREE_PER_SECOND),
			color: chillColor
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

			// Calculate the starting point of the line
			const lineStartRadius = radius * (47 / 100);
			const	lineEndRadius = radius - 21;

			// Calculate the start and end coordinates for the line
			const xStart = centerX + Math.cos(angle) * lineStartRadius;
			const yStart = centerY + Math.sin(angle) * lineStartRadius;

			const xEnd = centerX + Math.cos(angle) * lineEndRadius;
			const yEnd = centerY + Math.sin(angle) * lineEndRadius;

			// Draw a line from the center to the edge (clock-like)
			ctx.beginPath();
			ctx.moveTo(xStart, yStart);
			ctx.lineTo(xEnd, yEnd);  // End at the edge (outer radius)
			ctx.strokeStyle = 'rgba(200, 200, 200, 1)';  // Set the color of the line
			ctx.lineWidth = 1;  // Set the width of the line
			ctx.stroke();  // Draw the line
		});
	}
};

// Register the custom plugin in Chart.js
Chart.register(afterDrawPlugin);

// Define the colors to labels mapping
const colorToLabel = {
	[sleepColor]: 'Sleep', // Sleep color
	[chillColor]: 'Free Time', // Non-working color
	[workColor]: 'Working Sessions' // Working color
};

// Map the timelineSegments colors to labels
const uniqueLabels = [...new Set(timelineSegments.map(segment => colorToLabel[segment.color] || 'Unknown'))];

const dailyChart = new Chart(document.getElementById('dailyChart'), {
	type: 'doughnut',
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
