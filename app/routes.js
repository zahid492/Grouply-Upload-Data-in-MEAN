module.exports = function(router,app,io)
{
	//middleware for all routes
	router.use(function(req, res, next) {
		// do logging
		console.log('Something is happening on Sites.');
		next();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		res.json({ message: 'Welcome to the API Site:D!' });	
	});

	require('./routes/file_upload')(router,app);
	// on routes that end in /api
	// ----------------------------------------------------
	
};
