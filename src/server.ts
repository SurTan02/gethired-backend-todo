
const app = require('./app');

const port = process.env.PORT || 3030;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
    console.log(`Server run on http://${host}:${port}/`);
});
