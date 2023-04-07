from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class BoggleTestCase(TestCase):
    
    def setUp(self):
        """Stuff to do before EVERY test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_home(self):
        """Make sure home (board) is showing highscore and numplays"""
        with app.test_client() as client:
            # can now make requests to flask via `client`
            resp = client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('numplays'))
            self.assertIn(b'High Score:', resp.data)
            self.assertIn(b'Score:', resp.data)
            self.assertIn(b'Seconds Left:', resp.data)

    def test_valid_word(self):
        """Test if a word is valid (in dict and on board) by modifying board in the session"""
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"]]
            response = self.client.get('/check-word?word=cat')
            self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        """Test an invalid word, yep."""
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"]]
            response = self.client.get('/check-word?word=dog')
            self.assertEqual(response.json['result'], 'not-on-board')
        

    def test_not_valid_word(self):
        """Test a word that isn't in the dictionary."""
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"]]
            response = self.client.get('/check-word?word=asdjkf')
            self.assertEqual(response.json['result'], 'not-word')

    def test_post_score_sends_json(self):
        """Make sure that /post-score is receiving json correctly"""
        with self.client as client:
            response = client.post('/post-score', json={'score': 5}) # send json score: 5
            self.assertEqual(response.status_code, 200) # confirm its a 200 response
            self.assertEqual(response.content_type, 'application/json') # confirm its json!
            