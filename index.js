var express = require('express'),
    nunjucks = require('nunjucks'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    expressBunyanLogger = require('express-bunyan-logger'),
    config = require('./config');

var app = express();
app.disable('x-powered-by');

nunjucks.configure(__dirname + "/views", {
  autoescape: true,
  express   : app
});


app.use(express.static(path.join(__dirname, 'public')));

// all environments
app.set('port', process.env.PORT || 3031);
app.use(expressBunyanLogger({
  name: 'fake-partner',
  format: ':remote-address - :method :url :status-code :referrer :response-time ms',
  excludes: ['*']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(req, res){

  res.render('index.html', {
    title: 'Doshii Test Partner',
    meerkatHost: config.meerkat.host,
    apiVersion: config.meerkat.apiVersion
  });
});

app.post('/', function(req, res){

  var url = req.body.url;

  res.render('partner.html', {
    meerkatHost: url,
    title: 'Doshii Test Partner',
    clientId: req.body.clientId,
    clientSecret: req.body.clientSecret,
    primusUrl: url + '/socket/primus.js?v=' + new Date().getTime(),
    apiVersion: config.meerkat.apiVersion
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
