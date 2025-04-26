window.addEventListener('load', () => {
    const feed = document.querySelector('#received-message');
    const msgInput = document.querySelector("#msg-input");
    const button = document.querySelector('#msg-submit');
    const inputContainer = document.querySelector('.input-container'); // Access the container for input and button.

    // Ensure no message is displayed initially
    feed.innerHTML = ''; // Clear any previous messages, just in case

    button.addEventListener('click', () => {
        let msg = msgInput.value;

        if (!msg) return; // Prevent submission if the input is empty

        let messageObject = { message: msg };

        fetch('/new-message', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageObject)
        })
        .then(response => response.json())
        .then(data => {

            // Optional: Show a message telling the user to refresh to send another message
            const deliveryMessage = document.createElement('div');
            deliveryMessage.textContent = "As you toss your bottle out to shore, you notice another bottle washes ashore. You open it and read: ";
            feed.appendChild(deliveryMessage);

            // Display the random message after posting the new message
            const newMessage = document.createElement('div');
            newMessage.textContent = `${data.message}`;
            feed.appendChild(newMessage);

            // Hide the input and submit button after submission
            inputContainer.style.display = 'none'; // Hide the input box and button

            
        })
        .catch(error => {
            console.log(error);
        });

        msgInput.value = ""; // Clear the input field
    });
});
