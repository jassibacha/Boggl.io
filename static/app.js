class BoggleGame {
    constructor(boardId, secs = 60) {
        this.secs = secs; // Set game length
        // this.showTimer()
        // this.score = 0
        this.words = new Set();
        this.board = $('#' + boardId); // Set board to jQuery boardId element

        // Every 1000ms 'tick'
        // this.timer = setInterval(...) //bind this.tick to this

        $('.add-word', this.board).on('submit', this.handleSubmit.bind(this));
    }

    // Show word in list of words
    showWord(word) {}

    // Show score in HTML
    showScore() {}

    // Show status messages
    showMessage(msg, cls) {
        $('.alert', this.board)
            .text(msg)
            .removeClass()
            .addClass(`alert alert-${cls}`);
    }

    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $('.word', this.board);
        let word = $word.val();

        if (!word) return; // confirm word isn't falsy

        // Make sure that the word doesn't exist in words set
        if (this.words.has(word)) {
            this.showMessage(
                `You already found ${word}, try a new one!`,
                'error'
            );
            return;
        }

        // Check for the word
        const resp = await axios.get('/check-word', { params: { word: word } });
        console.log('Response Data:', resp.data);
        console.log('Response Data Result:', resp.data.result);

        // if goes here
        if (resp.data.result === 'not-word') {
        } else if (resp.data.result === 'not-on-board') {
        } else {
        }

        // Empty the text field and focus on it
        $word.val('').focus();
    }
}

// async function submitForm() {
//     const $form = $('#guess-form');

//     // add an empty set called words

//     // Form submission listener
//     $form.on('submit', async (event) => {
//         event.preventDefault(); // Prevent page refresh

//         const $word = $('.word');
//         const word = $word.val(); // Get the guessed word
//         console.log('word:', word);
//         if (!word) return; // if no word stop

//         // check if words already has the word const, if so show an error message

//         // const resp = await axios.post('/check-word', data: { word: word });

//         const resp = await axios.post(
//             '/check-word',
//             new FormData(event.target)
//         );

//         console.log('result', resp.data.result); // find the result in the data

//         // if goes here
//         // 'not-word'
//         // 'not-on-board'
//         // else add the word
//     });
// }

// submitForm();
