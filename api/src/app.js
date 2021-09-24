const express = require('express');

const appRouter = require('./routes');

const app = express();
const port = 3000;

// Pass app to create appilcation routes
appRouter(app);

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
