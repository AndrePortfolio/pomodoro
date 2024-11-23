from flask import Blueprint, render_template, session
from datetime import datetime
from cs50 import SQL
from helpers import login_required
from datetime import datetime, timedelta

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for statistics
statistics_bp = Blueprint('statistics', __name__)


@statistics_bp.route("/statistics")
@login_required
def statistics():
	# Get the current date and time
	now = datetime.now()

	# Today's data (start of today to end of today)
	today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
	today_end = now.replace(hour=23, minute=59, second=59, microsecond=0)

	# This week's data (start of this week to end of this week)
	start_of_week = now - timedelta(days=now.weekday())  # Start of the week (Monday)
	start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
	end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

	# This month's data (start of this month to end of this month)
	start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
	next_month = start_of_month.replace(month=now.month % 12 + 1)
	end_of_month = next_month - timedelta(days=0, seconds=1)

	# This year's data (start of this year to end of this year)
	start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
	end_of_year = now.replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=0)

	user_id = session["user_id"]
	# SQL queries to get data for each period
	daily = db.execute("SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? AND user_id = ?",
					today_start, today_end, user_id)
	weekly = db.execute("SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? AND user_id = ?",
					start_of_week, end_of_week, user_id)
	monthly = db.execute("SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? AND user_id = ?",
					start_of_month, end_of_month, user_id)
	yearly = db.execute("SELECT * FROM sessions WHERE timestamp >= ? AND timestamp <= ? AND user_id = ?",
					start_of_year, end_of_year, user_id)


	return render_template("statistics.html", daily=daily, weekly=weekly, monthly=monthly, yearly=yearly)


__all__ = ["statistics_bp"]
