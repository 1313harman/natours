const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./../starter/app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL!'));
// .catch((err) => console.error('DB CONNECTION ERROR:', err.message));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app runing on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  {
    console.log('👋SIGTERM RECEIVED, Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  }
});
