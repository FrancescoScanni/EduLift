//conf
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
