/* LOAD database module */
var User = require('../models/user.js');
/* GET home page. */
module.exports = function(app) {
  
	// home page 
	app.get('/', function (req, res) {
		res.render('index', { 
			title: 'Home Page',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});

	});


	// register page get request
	app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
		res.render('reg', {
		    title: 'Sign Up Page',
			user: req.session.user,
			success: req.flash('success').toString(),
		    error: req.flash('error').toString()
		});
	});

	// register post request
	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) { // deal with post request
		var name = req.body.name,
		  password = req.body.password,
		  password_re = req.body['password-repeat'],
		  email = req.body.email,
		  birth = req.body.birth;

		if(name || password || password_re || email || birth) {
			req.flash('error', 'Please fill out all the required field');
			return res.redirect('/reg');
		}

		req.flash('error', password_re);

		// check if the username is longer than 56 characters
		if(email.length > 56) {
		req.flash('error', 'Username cannot longer than 56 characters!');
			return res.redirect('/reg');
		}  

		// check if the passwords match.
		if (password.length < 6) {
			req.flash('error', 'password cannot less than 6 characters!');
			return res.redirect('/reg');
		}
		if (password_re != password) {
		req.flash('error', 'password does not mathch!'); 
		return res.redirect('/reg');//stay on the register page
		}

		var newUser = new User({
		  name: name,
		  password: password,
		  email: req.body.email
		});
		// check if user is already existed
		User.get(newUser.name, function (err, user) {
		if (err) {
		  req.flash('error', err);
		  return res.redirect('/');
		}
		if (user) {
		  req.flash('error', 'User already signed up!');
		  return res.redirect('/reg');//stay on reg
		}

		// if not, insert new user
		newUser.save(function (err, user) {
		  if (err) {
		    req.flash('error', err);
		    return res.redirect('/reg');
		  }
		  req.session.user = user;// save user info to session
		  req.flash('success', 'Register successfully!');
		  res.redirect('/');//login to home page
		});

		}); //  end of search database function

	}); //  end of post function

	app.use(function (req, res) {
 	  res.render("404");
	});


	function checkLogin(req, res, next) {
	if (!req.session.user) {
	  req.flash('error', 'Not login yet'); 
	  res.redirect('/login');
	}
	next();
	}

	function checkNotLogin(req, res, next) {
	if (req.session.user) {
	  req.flash('error', 'Already login'); 
	  res.redirect('back');
	}
	next();
	}

};

