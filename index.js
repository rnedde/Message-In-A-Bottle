import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Low(new JSONFile('db.json'), { messages: [] });

// Ensure that the database is correctly loaded before starting the server
db.read().then(() => {
  console.log('Database loaded:', db.data); // Check if data is loaded properly
});

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// GET route to retrieve all messages
app.get('/messages', async (_, res) => {
  await db.read(); // Make sure the database is loaded
  res.json(db.data.messages); // Serve the messages from the database
});

// POST route to save a new message
app.post('/new-message', async (req, res) => {
  const newMessage = { message: req.body.message };

  // Add the new message to the database
  db.data.messages.push(newMessage);

  try {
    await db.write(); // Save the updated database
    console.log('New message saved:', newMessage); // Log saved message
  } catch (error) {
    console.error('Error writing to the database:', error);
  }

  // Select a random message, excluding the most recent one
  const availableMessages = db.data.messages.slice(0, db.data.messages.length - 1); // Exclude last message
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const randomMessage = availableMessages[randomIndex];

  // Find the index of the random message in the original array
  const randomMessageIndex = db.data.messages.findIndex(msg => msg.message === randomMessage.message);

  // Delete the randomly selected message from the database
  if (randomMessageIndex !== -1) {
    db.data.messages.splice(randomMessageIndex, 1); // Remove the message at the selected index
    await db.write(); // Save the updated database
    console.log(`Message deleted: ${randomMessage.message}`);
  }

  res.json(randomMessage); // Send the random message back as a response
});
