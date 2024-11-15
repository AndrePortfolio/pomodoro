// Example data for the charts (Replace this with your actual data)
const dailyData = [2, 3, 4, 5, 6, 7, 8];
const weeklyData = [35, 40, 45, 50];
const monthlyData = [150, 160, 170, 180];
const yearlyData = [1800, 2000, 2200];

// Chart for daily work
const dailyChart = new Chart(document.getElementById('dailyChart'), {
	type: 'line',  // Type of chart (line, bar, etc.)
	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
		datasets: [{
			label: 'Hours Worked (Daily)',
			data: dailyData,
			fill: false,
			borderColor: 'rgba(75, 192, 192, 1)',
			tension: 0.1
		}]
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Daily Work Statistics'
			}
		}
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
