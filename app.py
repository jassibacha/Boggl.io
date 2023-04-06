from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "d9f8adsfa6g9sd0f89as789xz"
app.debug = True

toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()

board = boggle_game.make_board()

@app.route('/')
def home_page():
    """Show hompeage"""
    session['board'] = board
    highscore = session.get('highscore', 0) # if none, 0
    numplays = session.get('numplays', 0) # if none, 0
    #highscore
    #plays
    return render_template("board.html", board=board, highscore=highscore, numplays=numplays)

@app.route('/check-word', methods=['GET', 'POST'])
def check_word():
    """Check for the word"""
    print('check word')
    word = request.args['word']
    word = word.lower()
    # json fix
    # data = request.get_json()
    # word = data['word']
    print('word: ', word)
    board = session.get("board", boggle_game.make_board())
    print('board:', board)
    response = boggle_game.check_valid_word(board, word)
    print('response:', response)
    return jsonify({'result': response})

@app.route('/post-score', methods=['POST'])
def post_score():
    """Post the score, yo"""
    print('post-score route')
    score = request.json['score'] # Pull the score json
    print('score from json:', score)
    highscore = session.get('highscore', 0) # if none, 0
    print('highscore:', highscore)
    numplays = session.get('numplays', 0) # if none, 0
    print('numplays:', numplays)

    session['numplays'] = numplays + 1 # increment number of plays
    session['highscore'] = max(score, highscore) # grab whichever is higher

    return jsonify(brokeRecord = score > highscore) # If score is higher than current high score, brokeRecord boolean returns true!