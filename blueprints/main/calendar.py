from flask import Blueprint, render_template
from datetime import datetime
from cs50 import SQL
from helpers import login_required
import calendar

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for calendar
calendar_bp = Blueprint('calendar', __name__)


@calendar_bp.route("/calendar")
@login_required
def show_calendar():
	year = datetime.now().year
	months = []
	for month in range(1, 13):
		month_name = calendar.month_name[month]
		_, days_in_month = calendar.monthrange(year, month)
		first_weekday = calendar.monthrange(year, month)[0]
		months.append({"name": month_name, "days": days_in_month, "first_weekday": first_weekday})
	return render_template("calendar.html", year=year, months=months)


__all__ = ["calendar_bp"]
