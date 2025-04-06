import express from 'express';

const router = express.Router(); // Note: 'Router' must be capitalized

// Define a simple GET route for the user route
router.get('/', (req, res) => {
  res.send('Welcome to the User Route!');
});

// Export the router so it can be used in your main app
export default router;
