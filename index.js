const Pusher = require('pusher');
const namor = require('namor');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express()

const pusher = new Pusher({
  appId: '231188',
  key: '07a51219d95bf978b342',
  secret: 'db5c36d5b9f718f44f50',
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'i <3 vb.net'
}));

app.use(function (req, res, next) {
  if (!req.session.user_id) {
    req.session.user_id = namor.generate({numLen:1})
  }
  console.log(req.session.user_id)
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/pusher/auth', function (req, res) {
  const data = {
    user_id: req.session.user_id,
    user_info: { }
  }
  const {socket_id, channel_name} = req.body
  const authResponse = pusher.authenticate(
    socket_id,
    channel_name,
    data)
  res.send(authResponse)
});

const port = 3000;
app.listen(port, function (error) {
  if (error) {
    console.log(`An error occured ${error}`);
  } else {
    console.log(`Server running on port ${port}`);
  }
})
