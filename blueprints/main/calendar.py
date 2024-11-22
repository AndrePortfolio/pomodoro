from flask import Blueprint, render_template
from datetime import datetime
from cs50 import SQL
from helpers import login_required
import calendar

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
	months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	calendar_data = []

	# Calculate the first weekday and days for each month
	for month in range(12):
		# Get the weekday of the first day of the month (0=Monday, 6=Sunday)
		first_weekday = (calendar.monthrange(year, month + 1)[0] + 1) % 7
		days_in_month = get_days_in_month(year, month)

		# Add the month data (month name, first weekday, number of days)
		calendar_data.append({
			'name': months[month],
			'first_weekday': first_weekday,
			'days': days_in_month
		})

	return render_template("calendar.html", year=year, months=calendar_data)


__all__ = ["calendar_bp"]
