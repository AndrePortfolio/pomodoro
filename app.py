import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_session import Session
import calendar
from helpers import apology, login_required, lookup, is_int

# Create a Flask application instance<
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///pomodoro.db")

@app.after_request
def after_request(response):
	"""Ensure responses aren't cached"""
	response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	response.headers["Expires"] = 0
	response.headers["Pragma"] = "no-cache"
	return response


# Define a route for the root URL ("/")
@app.route('/')
def index():
	"""Redirect to login page if user is not logged in"""
	if not session.get("user_id"):
		return redirect(url_for("login"))
	return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
	"""Register user"""
	if request.method == "POST":
		username = request.form.get("username")
		password = request.form.get("password")
		confirmation = request.form.get("confirmation")
		if not username:
			return apology("must provide username", 400)
		elif not password or not confirmation:
			return apology("must provide password", 400)
		elif password != confirmation:
			return apology("password missmatch", 400)
		# Hash the password for db security
		hash = generate_password_hash(password, method='pbkdf2:sha256')
		try:
			new_user_id = db.execute("INSERT INTO users (username, hash) VALUES (?,?)", username, hash)
		except ValueError:
			return apology("username already exists", 400)
		# Log in the user by storing their id in session
		session["user_id"] = new_user_id
		flash(f"Successfully Registered.")
		# Redirect user to home page
		return redirect("/")
	else:
		return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
	"""Log user in"""
	# Forget any user_id
	session.clear()
	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":
		# Ensure username was submitted
		if not request.form.get("username"):
			return apology("must provide username", 403)
		# Ensure password was submitted
		elif not request.form.get("password"):
			return apology("must provide password", 403)
		# Query database for username
		rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))
		# Ensure username exists and password is correct
		if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
			return apology("invalid username and/or password", 403)
		# Remember which user has logged in
		session["user_id"] = rows[0]["id"]
		# Redirect user to home page
		return redirect("/")
	# User reached route via GET (as by clicking a link or via redirect)
	else:
		return render_template("login.html")


@app.route("/logout")
def logout():
	"""Log user out"""
	# Forget any user_id
	session.clear()
	# Redirect user to login form
	return redirect("/")


@app.route("/home")
@login_required
def home():
	"""Displays home page"""
	return render_template("index.html")


@app.route("/statistics")
@login_required
def statistics():
	"""Displayes statistics"""
	return render_template("statistics.html")


@app.route("/calendar")
@login_required
def _calendar():
	"""Displays a calendar"""
	year = datetime.now().year
	months = []

	for month in range(1, 13):
		month_name = calendar.month_name[month]
		_, days_in_month = calendar.monthrange(year, month)
		first_weekday = calendar.monthrange(year, month)[0]  # Weekday of the first day of the month
		months.append({
			'name': month_name,
			'days': days_in_month,
			'first_weekday': first_weekday
		})

	return render_template('calendar.html', year=year, months=months)



@app.route("/leaderboard")
@login_required
def leaderboard():
	"""Displays the leaderboard"""
	return render_template("leaderboard.html")


@app.route("/save-session", methods=["POST"])
@login_required
def save_session_time():
	"""Save the Pomodoro session time to the database"""
	if request.method == "POST":
		data = request.get_json()  # Get the JSON data from the request
		session_time = data.get("time")  # Time in seconds

		if session_time is None:
			return {"success": False, "message": "No time provided"}, 400

		# Insert the session time into the database
		user_id = session["user_id"]
		timestamp = datetime.now()

		db.execute("INSERT INTO sessions (user_id, session_time, timestamp) VALUES (?, ?, ?)", user_id, session_time, timestamp)

		return {"success": True}, 200



if __name__ == '__main__':
	app.run(debug=False, use_reloader=False)
