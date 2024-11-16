from flask import Blueprint, render_template, session, url_for, redirect, request
from datetime import datetime
from cs50 import SQL
from helpers import login_required
from .calendar import calendar_bp
from .leaderboard import leaderboard_bp
from .statistics import statistics_bp

# Blueprint for main pages
main_bp = Blueprint('main', __name__)
db = SQL("sqlite:///pomodoro.db")


# Register Blueprints
main_bp.register_blueprint(calendar_bp)
main_bp.register_blueprint(statistics_bp)
main_bp.register_blueprint(leaderboard_bp)


# Define a route for the root URL ("/")
@main_bp.route('/')
def index():
	"""Redirect to login page if user is not logged in"""
	if not session.get("user_id"):
		return redirect(url_for("auth.login"))
	return render_template("index.html")


@main_bp.route("/save-session", methods=["POST"])
@login_required
def save_session_time():
	"""Save the Pomodoro session time to the database"""
	if request.method == "POST":
		data = request.get_json()  # Get the JSON data from the request
		if not data:
			return {"success": False, "message": "No data received"}, 400

		session_time = data.get("time")  # Time in seconds
		if session_time is None:
			return {"success": False, "message": "No time provided"}, 400

		# Insert the session time into the database
		user_id = session["user_id"]
		timestamp = datetime.now()

		db.execute("INSERT INTO sessions (user_id, session_time, timestamp) VALUES (?, ?, ?)", user_id, session_time, timestamp)

		return {"success": True}, 200


__all__ = ["main_bp"]
