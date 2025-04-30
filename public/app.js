window.addEventListener('load', async () => {
    const feed = document.querySelector('#received-message');
    const msgInput = document.querySelector("#msg-input");
    const button = document.querySelector('#msg-submit');
    const inputContainer = document.querySelector('.message-container');
    const instructionsContainer = document.querySelector('.instructions');
    const introContainer = document.querySelector('#intro');
  
    // Clear the intro and add typewriter effect to it
    const introParagraphs = [
      "What you write will be tossed out into the endless sea, carried by the currents and received by someone else in the future. Whether it is the next person or the one after that, trust that your message will be found and read.",
      "Offer what you wish to share: a confession, a story, a poem, or a wish. But know this—the sea does not reveal its secrets. You may never know who finds your message or when it will arrive. Once your words are set free, a message will return to you—an anonymous voice, floating back from the tide.",
      "Your message will be shared anonymously with another visitor. Once delivered, it won't be stored or saved anywhere.",
      "Messages are anonymous, but intended to bring warmth, curiosity, or reflection to a stranger. Please be kind."
    ];
  
    // Typewriter function for a paragraph
    const typeParagraph = async (text, container) => {
        const p = document.createElement('p');
        container.appendChild(p);
      
        // Type the paragraph one letter at a time
        for (let i = 0; i < text.length; i++) {
          p.textContent += text[i];
          await new Promise(resolve => setTimeout(resolve, 15));
        }
    
      };
  
    // Type all intro paragraphs one by one
    introContainer.innerHTML = ''; // Clear static HTML
    for (const para of introParagraphs) {
      await typeParagraph(para, introContainer);
      await new Promise(resolve => setTimeout(resolve, 300)); // Pause between paragraphs
    }
  
    // After intro finishes typing, input box becomes visible
    inputContainer.style.display = 'block';
  
    // ... the rest of your existing button click logic follows
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
