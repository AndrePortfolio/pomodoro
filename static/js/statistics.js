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
function convertToUnixTimestamp(timestamp) {
  const date = new Date(timestamp); // Convert to Date object
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
  const startTime = convertToUnixTimestamp(session.timestamp) % SECONDS_IN_A_DAY; // Start time (seconds)
  const finishTime = startTime + session.session_time; // Finish time (seconds)

  // Add a non-working segment if there is a gap
  if (startTime > lastEnd) {
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
if (lastEnd < SECONDS_IN_A_DAY) {
  timelineSegments.push({
    degrees: (SECONDS_IN_A_DAY - lastEnd) * DEGREE_PER_SECOND,
    color: 'rgba(200, 200, 200, 0.3)' // Non-working color
  });
}

// Debugging: Log the timeline segments
console.log(timelineSegments);

const dailyChart = new Chart(document.getElementById('dailyChart'), {
	type: 'pie',
	data: {
	  labels: timelineSegments.map((_, i) => `Segment ${i + 1}`),
	  datasets: [{
		data: timelineSegments.map(segment => segment.degrees),
		backgroundColor: timelineSegments.map(segment => segment.color),
		borderColor: 'rgba(255, 255, 255, 0.5)',
		borderWidth: 0.5,
	  }]
	},
	options: {
	  responsive: true,
	  maintainAspectRatio: true, // Ensures the chart stays circular
	  plugins: {
		title: {
		  display: true,
		  text: 'Daily Work Timeline (24-Hour Clock)'
		},
		legend: {
		  display: false
		},
	  },
	  rotation: Math.PI / -2,
	  circumference: Math.PI * 2,
	  cutout: '80%', // Optional for a clock-like appearance
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
