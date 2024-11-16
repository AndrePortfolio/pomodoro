from flask import Blueprint, render_template, redirect, request, session, flash
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL
from helpers import apology

# Blueprint for auth-related routes
auth_bp = Blueprint('auth', __name__)

# Initialize database connection
db = SQL("sqlite:///pomodoro.db")

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
	if request.method == "POST":
		username = request.form.get("username")
		password = request.form.get("password")
		confirmation = request.form.get("confirmation")
		if not username:
			return apology("must provide username", 400)
		elif not password or not confirmation:
			return apology("must provide password", 400)
		elif password != confirmation:
			return apology("password mismatch", 400)
		hash = generate_password_hash(password, method='pbkdf2:sha256')
		try:
			new_user_id = db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, hash)
		except ValueError:
			return apology("username already exists", 400)
		session["user_id"] = new_user_id
		flash("Successfully Registered.")
		return redirect("/")
	return render_template("register.html")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
	session.clear()
	if request.method == "POST":
		username = request.form.get("username")
		password = request.form.get("password")
		if not username:
			return apology("must provide username", 403)
		elif not password:
			return apology("must provide password", 403)
		rows = db.execute("SELECT * FROM users WHERE username = ?", username)
		if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
			return apology("invalid username and/or password", 403)
		session["user_id"] = rows[0]["id"]
		return redirect("/")
	return render_template("login.html")


@auth_bp.route("/logout")
def logout():
	session.clear()
	return redirect("/login")

__all__ = ["auth_bp"]
