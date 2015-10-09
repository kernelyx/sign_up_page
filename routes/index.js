/* GET home page. */
module.exports = function(app) {

  app.get('/', function (req, res) {
    res.render('index', { title: 'First Page' });
  });
  app.get('/reg', function (req, res) {
    res.render('reg', { title: 'Sign Up Page' });
  });
  app.post('/reg', function (req, res) {
  });

};

