window.addEventListener('load', () => {
    const feed = document.querySelector('#received-message');
    const msgInput = document.querySelector("#msg-input");
    const button = document.querySelector('#msg-submit');
    const inputContainer = document.querySelector('.input-container');
    const instructionsContainer = document.querySelector('.instructions');
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
        .then(async data => {  // ⬅ make this function async so we can use await inside

                        // Hide the input and submit button after submission
                        inputContainer.style.display = 'none';
                        instructionsContainer.style.display = 'none';
            const messages = [
                "As you toss your bottle out to sea...",
                "you notice another bottle washes ashore.",
                "You open it and read: "
            ];
        
            const typeMessage = async (text, container) => {
                const div = document.createElement('div');
                container.appendChild(div);
                
                for (let i = 0; i < text.length; i++) {
                    div.textContent += text[i];
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
            };
        
            const showMessages = async () => {
                for (const message of messages) {
                    await typeMessage(message, feed);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            };
        
            await showMessages();  // ⬅ WAIT until all delivery messages are typed out
        
            // Now display the random message
            const newMessage = document.createElement('div');
            newMessage.id = 'new-message';
            newMessage.textContent = `${data.message}`;
            newMessage.classList.add('fade-message');
            feed.appendChild(newMessage);
        

        })
        
        .catch(error => {
            console.log(error);
        });

        msgInput.value = ""; // Clear the input field
    });
});
