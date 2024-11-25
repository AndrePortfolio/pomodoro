from flask import Blueprint, render_template
from datetime import datetime
from cs50 import SQL
from helpers import login_required

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for leaderboard
leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route("/leaderboard")
@login_required
def leaderboard():
	# Get the current date in the correct format
	today = datetime.now().strftime("%Y-%m-%d")

	# Query the database to get total session time for each user today
	query = """
		SELECT u.username, SUM(s.session_time) AS total_time
		FROM users u
		JOIN sessions s ON u.id = s.user_id
		WHERE DATE(s.timestamp) = ?
		GROUP BY u.id
		ORDER BY total_time DESC
	"""
	leaderboard_data = db.execute(query, today)
	if not leaderboard_data:
		return render_template("leaderboard.html", message="No sessions recorded today.")

	index = 1
	# Convert session time to hours and minutes
	for entry in leaderboard_data:
		total_seconds = entry['total_time']
		hours = total_seconds // 3600
		minutes = (total_seconds % 3600) // 60
		entry['total_time'] = f"{hours}h {minutes}m"
		entry['rank'] = index
		index += 1

	# Limit the leaderboard data to a maximum of 10 users
	leaderboard_data = leaderboard_data[:10]

	print(leaderboard_data)

	# Render the leaderboard with the leaderboard data
	return render_template("leaderboard.html", leaderboard_data=leaderboard_data)


__all__ = ["leaderboard_bp"]
