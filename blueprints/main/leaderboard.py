from flask import Blueprint, render_template
from datetime import datetime
from cs50 import SQL
from helpers import login_required
import calendar

# Blueprint for main pages
db = SQL("sqlite:///pomodoro.db")

# Create a blueprint for leaderboard
leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route("/leaderboard")
@login_required
def leaderboard():
	return render_template("leaderboard.html")


__all__ = ["leaderboard_bp"]
