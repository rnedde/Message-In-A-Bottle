window.addEventListener('load', async () => {
    const feed = document.querySelector('#narration-container');
    const msgInput = document.querySelector("#msg-input");
    const button = document.querySelector('#msg-submit');
    const inputContainer = document.querySelector('.user-message-container');
    const instructionsContainer = document.querySelector('.instructions');
    const composeBtn = document.querySelector('#compose-btn');
    const btnContainer = document.querySelector('.btn-container');  // Get the btn-container

    const narrationMessages = [
        "What you write will be tossed out into the endless sea, carried by the currents and received by someone else in the future...",
        "Offer what you wish to share: a confession, a story, a poem, or a wish...",
        "Your message will be shared anonymously with another visitor...",
        "Messages are anonymous, but intended to bring warmth, curiosity, or reflection to a stranger...",
        "As you toss your bottle out to sea...",
        "You notice another bottle washes ashore.",
        "You open it and read: ",
    ];

    const typeNarrationMessage = async (text, container, tag = 'p') => {
        const el = document.createElement(tag);
        if (container.contains(composeBtn)) {
            container.insertBefore(el, composeBtn);
        } else {
            container.appendChild(el);
        }
        for (let i = 0; i < text.length; i++) {
            el.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, 15));
        }
    };

    // Show first 2 intro paragraphs
    feed.innerHTML = '';  // Clear feed initially
    for (let i = 0; i < 2; i++) {
        await typeNarrationMessage(narrationMessages[i], feed);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Show compose button after the first two messages
    composeBtn.classList.add('visible');
    composeBtn.style.display = 'inline-block';

    composeBtn.addEventListener('click', async () => {
        // Clear the feed before showing the next paragraphs
        feed.innerHTML = '';
        // Hide the compose button when clicked
        composeBtn.style.display = 'none';

        // Type remaining intro paragraphs
        for (let i = 2; i < 4; i++) {
            await typeNarrationMessage(narrationMessages[i], feed);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        inputContainer.classList.add('visible');
    });

    button.addEventListener('click', async () => {
        let msg = msgInput.value;
        if (!msg) return;

        fetch('/new-message', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        })
            .then(response => response.json())
            .then(async data => {
                inputContainer.style.display = 'none';
                instructionsContainer.style.display = 'none';
                feed.innerHTML = '';

                // Type third-page narration messages
                for (let i = 4; i < narrationMessages.length; i++) {
                    await typeNarrationMessage(narrationMessages[i], feed, 'p');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const newMessage = document.createElement('div');
                newMessage.id = 'new-message';
                newMessage.textContent = data.message;
                feed.appendChild(newMessage);

                setTimeout(() => {
                    newMessage.classList.add('visible');
                }, 50); // Delay to ensure the new message is added

                // Wait for the message to finish fading in before showing the message
                setTimeout(() => {
                    const endNarration = document.querySelector('.end-msg');
                    endNarration.style.display = 'flex';
                    setTimeout(() => {
                        endNarration.classList.add('visible');
                    }, 50);
                }, 1050);
            })
            .catch(console.log);
        msgInput.value = "";
    });


    

});
