// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const http = require('http');
const socketIo = require('socket.io');
const companyRoutes = require('./routes/companyRoutes');
const individualRoutes = require('./routes/individualRoutes');
const reportRoutes = require('./routes/report');
const tickedIndividualsRoutes = require('./routes/tickedIndividualRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/companies', companyRoutes);
app.use('/api/individuals', individualRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ticked-individuals', tickedIndividualsRoutes);

const server = http.createServer(app);
const io = socketIo(server);

module.exports.io = io;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
