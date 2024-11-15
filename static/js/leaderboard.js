// Sort users by time worked (descending)
users.sort((a, b) => b.time - a.time);

// Get the leaderboard container
const leaderboardRows = document.querySelector(".leaderboard-rows");

// Clear existing rows
leaderboardRows.innerHTML = ""; // Clear all static rows

// Add users dynamically
users.forEach((user, index) => {
    const row = document.createElement("div");
    row.classList.add("leaderboard-row");

    row.innerHTML = `
        <div class="rank">${index + 1}</div>
        <div class="user">${user.name}</div>
        <div class="time">${user.time}</div>
    `;

    leaderboardRows.appendChild(row);
});

