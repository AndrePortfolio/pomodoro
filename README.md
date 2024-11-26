# Pomodoro Productivity App

#### Video Demo: [Insert Your YouTube URL Here]

#### Description:
The Pomodoro Productivity App is a time management tool based on the Pomodoro Technique, designed to help users manage their time more effectively by breaking work into intervals, traditionally 25 minutes in length, separated by short breaks. The app provides a full-featured experience with user authentication, task management, detailed statistics, and a leaderboard system to track the most productive users.

This application allows users to **register** and **log in** to manage their personalized tasks, set Pomodoro timers, track their productivity, and compare their performance with others through a **leaderboard**. Users can see detailed statistics on their work intervals and breaks, and the **calendar** feature helps visualize daily progress.

### Key Features:
- **User Authentication**: Users can register and log in to create personalized accounts. Multiple users can sign up and track their individual progress.
- **Pomodoro Timer**: The main feature is the Pomodoro timer, which allows users to work in focused intervals and take short breaks in between.
- **Statistics**: The app tracks the total number of Pomodoros completed, total work time, and provides other key statistics for each user. This data can be viewed on the dashboard.
- **Leaderboard**: A dynamic leaderboard displays the most productive users based on the number of Pomodoros completed, motivating users to improve their productivity.
- **Calendar**: A built-in calendar feature allows users to see their progress over time, marking the days they worked and providing a historical overview of their performance.

### File Breakdown:
- **app.py**: The main Flask application file. It handles routing, user authentication, Pomodoro timer logic, and serves the application’s HTML templates.
- **templates/**: This folder contains HTML files for rendering the front-end. Key templates include:
  - `index.html`: The home page where users can register, log in, and access the Pomodoro timer.
  - `leaderboard.html`: Displays the leaderboard, showing users who have completed the most Pomodoros.
  - `stats.html`: Shows detailed statistics for the logged-in user, such as the total Pomodoros completed and work time.
  - `calendar.html`: Displays a calendar with the user’s progress for the month.
- **static/**: This folder contains static assets such as CSS and JavaScript files used to style the app and add interactivity.
- **models.py**: Defines the database models used to store user information, Pomodoro session data, and leaderboard data.
- **requirements.txt**: Contains the list of dependencies required to run the application, including Flask and other packages for handling database interactions, authentication, and more.

### Key Design Decisions:
- **User Authentication**: I chose to use Flask’s built-in session management and a SQLite database to store user credentials and Pomodoro session data. This approach provides simple authentication for multiple users without requiring external services like OAuth or JWT.
- **Pomodoro Timer**: The timer runs in the browser using JavaScript, ensuring that users can stay focused on their tasks without interruptions. The timer can be paused or reset during the work and break intervals.
- **Leaderboard**: The leaderboard tracks the number of Pomodoros completed and ranks users accordingly. This feature motivates users to continue working and helps visualize their progress relative to others.
- **Statistics & Calendar**: These features provide users with a way to track their long-term progress. The calendar integrates seamlessly with the statistics, showing users which days they completed Pomodoros.

### Future Enhancements:
- **Mobile App**: I plan to expand this project into a mobile application to provide a more seamless user experience across devices.
- **Pomodoro Customization**: Allow users to customize the duration of the work and break intervals.
- **Social Features**: Incorporate social features such as sharing achievements or competing in challenges with other users.

### Technologies Used:
- **Python**: For backend logic and handling user sessions, Pomodoro timer, and statistics tracking.
- **Flask**: A lightweight web framework for building web applications.
- **SQLite**: A simple database to store user data, Pomodoro session data, and leaderboard information.
- **HTML/CSS/JavaScript**: For building the front-end of the app, including the Pomodoro timer interface and user interactions.
- **Jinja2**: Flask’s templating engine for rendering dynamic HTML pages.
- **Bootstrap**: Used for responsive and aesthetically pleasing UI design.

### Running the App:
1. **Clone this repository** to your local machine.
2. Navigate to the project folder and install dependencies:
