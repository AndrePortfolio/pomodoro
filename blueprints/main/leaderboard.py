from flask import Blueprint, render_template, request, session
from datetime import datetime, timedelta
from cs50 import SQL
from helpers import login_required

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for leaderboard
leaderboard_bp = Blueprint('leaderboard', __name__)

# The list of timeframes available for the leaderboard
TIMEFRAMES = ['today', 'this_week', 'this_month', 'this_year', 'all_time']

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def show_leaderboard():
	# Get the current timeframe from the query parameters (or default to 'today')
	timeframe = request.args.get('timeframe', 'today')
	action = request.args.get('action')  # Check if action (prev/next) is specified

	# Initialize current_index from the session, defaulting to 0 if not present
	current_index = session.get('current_index', 0)

	# Handle actions to move the current index (prev/next)
	if action == 'prev':
		current_index = (current_index - 1) % len(TIMEFRAMES)  # Wrap around with modulo
	elif action == 'next':
		current_index = (current_index + 1) % len(TIMEFRAMES)  # Wrap around with modulo

	# Save the updated index back to the session
	session['current_index'] = current_index

	# Get the updated timeframe based on current_index
	timeframe = TIMEFRAMES[current_index]

	# Call the leaderboard function with the updated timeframe
	return leaderboard(timeframe)


def leaderboard(timeframe):
	# Get the current date in the correct format
	today = datetime.today()

	# Set start_date and end_date based on the timeframe
	if timeframe == 'today':
		start_date = end_date = today.strftime("%Y-%m-%d")
	elif timeframe == 'this_week':
		start_date = (datetime.now() - timedelta(days=datetime.now().weekday())).strftime("%Y-%m-%d")  # Start of the week
		end_date = today  # End date is today
	elif timeframe == 'this_month':
		start_date = datetime(today.year, today.month, 1).strftime("%Y-%m-%d")
		end_date = today
	elif timeframe == 'this_year':
		start_date = datetime(today.year, 1, 1).strftime("%Y-%m-%d")
		end_date = today
	elif timeframe == 'all_time':
		start_date = '2000-01-01'  # Or use any appropriate earliest date
		end_date = today
	else:
		start_date = end_date = today

	print(f"Start date: {start_date}, End date: {end_date}")

	# Query the database for the leaderboard data within the date range
	query = """
		SELECT users.username, SUM(sessions.session_time) AS total_time
		FROM users
		JOIN sessions ON users.id = sessions.user_id
		WHERE DATE(sessions.timestamp) BETWEEN ? AND ?
		GROUP BY users.id
		ORDER BY total_time DESC
	"""

	# Execute the query with the appropriate date range
	leaderboard_data = db.execute(query, start_date, end_date)

	# If no data, handle it
	if not leaderboard_data:
		return render_template("leaderboard.html", message="No sessions recorded for this timeframe.")

	# Convert session times and rank
	index = 1
	for entry in leaderboard_data:
		total_seconds = entry['total_time']
		hours = total_seconds // 3600
		minutes = (total_seconds % 3600) // 60
		entry['total_time'] = f"{hours}h {minutes}m"
		entry['rank'] = index
		index += 1

	# Limit the leaderboard data to a maximum of 10 users
	leaderboard_data = leaderboard_data[:10]


	# Render the leaderboard with the leaderboard data
	return render_template("leaderboard.html", leaderboard_data=leaderboard_data)



__all__ = ["leaderboard_bp"]
