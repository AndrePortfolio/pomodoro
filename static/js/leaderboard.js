const blurredLeaderboards = document.querySelectorAll('.blurred-leaderboard');
const prevBtn = document.querySelector('.prev-leaderboard');
const nextBtn = document.querySelector('.next-leaderboard');
let currentIndex = 0;

function showLeaderboard(index) {
	blurredLeaderboards.forEach((board, i) => {
		board.style.display = i === index ? 'block' : 'none';
	});
}

prevBtn.addEventListener('click', () => {
	currentIndex = (currentIndex - 1 + blurredLeaderboards.length) % blurredLeaderboards.length;
	showLeaderboard(currentIndex);
});

nextBtn.addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % blurredLeaderboards.length;
	showLeaderboard(currentIndex);
});

// Show the initial leaderboard
showLeaderboard(currentIndex);
