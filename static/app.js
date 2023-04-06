class BoggleGame {
    constructor(boardId, secs = 60) {
        this.secs = secs; // Set game length
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $('#' + boardId); // Set board to jQuery boardId element

        // console.log('this:', this);
        // console.log('this.tick:', this.tick);
        // Every 1000ms 'tick'
        this.timer = setInterval(this.tick.bind(this), 1000); //
        //console.log('this.tick (binded):', this.tick);

        $('#guess-form').on('submit', this.handleSubmit.bind(this));
    }

    // Show word in list of words
    showWord(word) {
        $('.words-list', this.board).append($('<li>', { text: word }));
    }

    // Show score in HTML
    showScore() {
        console.log('show score:', this.score);
        $('.score', this.board).text(this.score);
    }

    // Show status messages
    showMessage(msg, cls) {
        $('.alert', this.board)
            .text(msg)
            .removeClass()
            .addClass(`alert alert-${cls}`);
    }

    showTimer() {
        // update .timer txt to show remaining seconds
        $('.timer', this.board).text(this.secs);
    }

    async tick() {
        this.secs -= 1; // minus secs(this) by 1
        this.showTimer(); // refresh the timer
        if (this.secs === 0) {
            console.log('We made it to 0 seconds, score the game and stop!');
            clearInterval(this.timer); // clearinterval of the timer
            await this.scoreGame();
        }
    }

    async scoreGame() {
        console.log('scoreGame() init');
        $('.add-word', this.board).hide(); // hide the form to add words

        // setup axios call to post score ('/post-score') and send score: this.score
        const res = await axios
            .post('/post-score', { score: this.score })
            .then((resp) => {
                console.log('post-score response:', resp);
                if (resp.data.brokeRecord) {
                    // Check the brokeRecord JSON from flask route
                    this.showMessage(
                        `New High Score: ${this.score}`,
                        'success'
                    );
                } else {
                    this.showMessage(`Final Score: ${this.score}`, 'success');
                }
                // new record
                // else
                // final score
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async handleSubmit(evt) {
        evt.preventDefault();
        console.log('handleSubmit called');
        const $word = $('.word');
        console.log($word);
        let word = $word.val();
        console.log(`word = ${word}`);

        if (!word) return; // confirm word isn't falsy

        // Make sure that the word doesn't exist in words set
        if (this.words.has(word)) {
            this.showMessage(
                `You already found ${word}, try a new word!`,
                'warning'
            );
            return;
        }

        //console.log('Axios V2 get starting');
        // Check for the word
        const res = await axios
            .get('/check-word', { params: { word: word } })
            .then((resp) => {
                if (resp.data.result === 'not-word') {
                    console.log(`${word} isn't on the board.`);
                    //console.log('this:', this);
                    this.showMessage(`${word} isn't a word, sorry!`, 'danger');
                } else if (resp.data.result === 'not-on-board') {
                    console.log(`${word} isn't on the board.`);
                    //console.log('this:', this);
                    this.showMessage(`${word} isn't on the board.`, 'danger');
                } else {
                    console.log(`${word} is on the board! Nice!`);
                    //console.log('this:', this);
                    this.showWord(word);
                    this.score += word.length; // Add to score
                    this.showScore(); // Update score on front-end
                    this.words.add(word); // Add to the words set
                    this.showMessage(`Added ${word}!`, 'success');
                }
            })
            .catch((error) => {
                console.log(error);
            });

        // console.log('Axios V2 get starting');
        // // Check for the word
        // const resp = await axios.get('/check-word', { params: { word: word } });

        // console.log(resp.data);
        // if (resp.data.result === 'not-word') {
        //     console.log(`${word} isn't on the board.`);
        //     //console.log('this:', this);
        //     this.showMessage(`${word} isn't a word, sorry!`, 'danger');
        // } else if (resp.data.result === 'not-on-board') {
        //     console.log(`${word} isn't on the board.`);
        //     //console.log('this:', this);
        //     this.showMessage(`${word} isn't on the board.`, 'danger');
        // } else {
        //     console.log(`${word} is on the board! Nice!`);
        //     //console.log('this:', this);
        //     this.showWord(word);
        //     this.score += word.length; // Add to score
        //     this.showScore(); // Update score on front-end
        //     this.words.add(word); // Add to the words set
        //     this.showMessage(`Added ${word}!`, 'success');
        // }

        // Empty the text field and focus on it
        $word.val('').focus();
    }
}
