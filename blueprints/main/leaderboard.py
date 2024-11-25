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
	users_today = db.execute(query, today)

	# Prepare data for rendering
	leaderboard_data = [
		{
			"username": user["username"],
			"total_time": user["total_time"]
		}
		for user in users_today
	]
	print(users_today)

	# Render the leaderboard with the leaderboard data
	return render_template("leaderboard.html", leaderboard_data=leaderboard_data)


__all__ = ["leaderboard_bp"]
