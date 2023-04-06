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
    #highscore
    #plays
    return render_template("board.html", board=board)

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
    board = session['board']
    print('board:', board)
    response = boggle_game.check_valid_word(board, word)
    print('response:', response)
    return jsonify({'result': response})
