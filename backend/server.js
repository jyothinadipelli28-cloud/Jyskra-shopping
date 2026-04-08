const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

connectDB()
  .then(() => {
    app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
  })
  .catch(error => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
