const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const config = require('./config');
const { port } = config;

const apiRouter = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', apiRouter);

app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.get('/*', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../index.html')));

// handle unknown routes
app.use('*', (req, res) => res.status(404).send('The requested URL was not found on this server'));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
