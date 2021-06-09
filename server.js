//Install express server
const express = require('express');
const path = require('path');

const app = express();

// const consolere = require('console-remote-client').connect({
//   server: 'https://console.re',
//   channel: 'experiment1-tue', // required
//   redirectDefaultConsoleToRemote: true, // optional, default: false
//   disableDefaultConsoleOutput: true, // optional, default: false
// });

// console.re.log('remote log test from node');

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

