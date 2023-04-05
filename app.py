from flask import Flask, request, render_template, redirect, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "d9f8adsfa6g9sd0f89as789xz"
app.debug = True

toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def home_page():
    """Show hompeage"""
    boggle_game.make_board()
    # ADD BOGGLE TO THE SESSION.... !
    return render_template("home.html")
