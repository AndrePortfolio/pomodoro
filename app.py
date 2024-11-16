from flask import Flask
from cs50 import SQL
from flask_session import Session
from blueprints.auth import auth_bp
from blueprints.main import main_bp

# Initialize Flask app
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Database configuration
db = SQL("sqlite:///pomodoro.db")


# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)


@app.after_request
def after_request(response):
	response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	response.headers["Expires"] = 0
	response.headers["Pragma"] = "no-cache"
	return response


if __name__ == '__main__':
	app.run(debug=False, use_reloader=False)
