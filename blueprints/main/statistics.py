from flask import Blueprint, render_template
from datetime import datetime
from cs50 import SQL
from helpers import login_required
import calendar

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for statistics
statistics_bp = Blueprint('statistics', __name__)


@statistics_bp.route("/statistics")
@login_required
def statistics():
	return render_template("statistics.html")


__all__ = ["statistics_bp"]
