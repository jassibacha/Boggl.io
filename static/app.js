const $form = $('#guess-form');
const $guess = $('#word');

// add an empty set called words

// Form submission listener
$form.on('submit', (event) => {
    event.preventDefault(); // Prevent page refresh

    const word = $guess.val(); // Get the guessed word
    if (!word) return;

    // check if words already has the word const, if so show an error message

    const resp = await axios.get('/check-word', { params: { word: word }});

    print(resp) // find the result in the data

    // if goes here
    // 'not-word'
    // 'not-on-board'
    // else add the word

    // axios
    //     .post('/check-word', { word })
    //     .then((response) => {
    //         const isValid = response.data.isValid;
    //         // Update the page based on whtether word is valid or not
    //         if (isValid) {
    //             console.log('word is valid');
    //             return True;
    //         } else {
    //             // Do something else
    //             console.log('word is NOT valid');
    //             return False;
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
});
