var restify = require('restify');
var botbuilder = require('botbuilder');

// setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function(){
	console.log('%s bot started at %s', server.name, server.url);
});


// create chat connector
var connector = new botbuilder.ChatConnector({
	appId: process.env.APP_ID,
	appPassword: process.env.APP_SECRET
});


// listening for user inputs
server.post('/api/messages', connector.listen());

// Reply by echoing 
var bot = new botbuilder.UniversalBot(connector, function(session){
	session.send(`You have tapped: ${session.message.text}`);
	// session.send(`Type: ${session.message.type}`);

	bot.on('typing', function(){
		session.send('Plus vite...');
	});

	bot.on('conversationUpdate', function(message){
		// user join
		if(message.membersAdded && message.membersAdded.length > 0){
			var membersAdded = message.membersAdded
				.map(function(x){
					var isSelf = x.id === message.address.bot.id;
					return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id = ' + x.id + ')'
				}).join(', '); //sépare le tableau en string

			bot.send(new botbuilder.Message()
				.address(message.address)
				.text('L\'utilisateur ' + membersAdded + ' a rejoint la conversation')
			);
		}
		// user removed
		else if(message.membersRemoved && message.membersRemoved.length > 0){
			var membersRemoved = message.membersRemoved
			.map(function(x){
				return (x.id)
			}).join(', ');

			bot.send(new botbuilder.Message()
				.address(message.address)
				.text('L\'utilisateur ' + membersRemoved + ' a quitté la conversation')
			);
		}		
	});

	bot.on('contactRelationUpdate', function(message){
		// bot join
		if(message.action == 'add'){
			bot.send(new botbuilder.Message()
				.address(message.address)
				.text('Le bot ' + message.address.bot.id + ' a rejoint la conversation')
			);
		}
		// bot remove
		else if(message.action == 'remove'){
			bot.send(new botbuilder.Message()
				.address(message.address)
				.text('Le bot ' + message.address.bot.id + ' a quitté la conversation')
			);
		}
	});
});




