yearSessions = yearData.map(session => session.session_time);

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
