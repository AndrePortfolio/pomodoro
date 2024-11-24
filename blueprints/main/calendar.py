from flask import Blueprint, render_template, session
from datetime import datetime
from cs50 import SQL
from helpers import login_required
import calendar
from collections import defaultdict

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for calendar
calendar_bp = Blueprint('calendar', __name__)


def is_leap_year(year):
	return (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0))


def get_days_in_month(year, month):
	days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	if month == 1:  # February
		return 29 if is_leap_year(year) else 28
	return days_in_month[month]


@calendar_bp.route('/calendar', defaults={'year': datetime.now().year})
@calendar_bp.route('/calendar/<int:year>')
@login_required
def show_calendar(year):
	# Get the current date and time
	user_id = session["user_id"]

	months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]

	# This year's data (start of this year to end of this year)
	start_of_year = f'{year}-01-01 00:00:00'
	end_of_year = f'{year}-12-31 23:59:59'
	year_data = db.execute("SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? AND user_id = ?",
					start_of_year, end_of_year, user_id)

	# Organize session data by date
	sessions_by_date = defaultdict(list)
	for row in year_data:
		timestamp = row['timestamp']
		session_date = timestamp.split(' ')[0]  # Extract `YYYY-MM-DD` part
		sessions_by_date[session_date].append(row['session_time'])

	# Init lists
	calendar_data = []

	# Calculate the first weekday and days for each month
	for month in range(12):
		# Get the weekday of the first day of the month (0=Monday, 6=Sunday)
		first_weekday = (calendar.monthrange(year, month + 1)[0] + 1) % 7
		days_in_month = get_days_in_month(year, month)

		# Add the month data (month name, first weekday, number of days)
		month_data = {
			'name': months[month],
			'first_weekday': first_weekday,
			'days': days_in_month,
			'days_data': []
		}
		 # Iterate through days in the month
		for day in range(1, days_in_month + 1):
			date_key = f"{year}-{month + 1:02d}-{day:02d}"  # Format date as `YYYY-MM-DD`
			day_sessions = sessions_by_date.get(date_key, [])  # Get sessions for this day
			if not day_sessions:
				day_sessions = [0]
			month_data['days_data'].append({
				'day': day,
				'sessions': day_sessions  # Add session data
			})
		print(month_data)
		calendar_data.append(month_data)

	return render_template("calendar.html", year=year, months=calendar_data)


__all__ = ["calendar_bp"]
