var ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection) {
	this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.insert({
				usuario: usuario,
				moeda: 15,
				suditos: 10,
				temor: Math.floor(Math.random() * 1000),
				sabedoria: Math.floor(Math.random() * 1000),
				comercio: Math.floor(Math.random() * 1000),
				magia: Math.floor(Math.random() * 1000)
			});
			mongoclient.close();
		});
	});
}

JogoDAO.prototype.iniciaJogo = function(msg, req, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.find({usuario: req.session.usuario}).toArray(function(err, result){	
				res.render('jogo', {img_casa: req.session.casa, jogo: result[0], msg: msg});
			});
			mongoclient.close();
		});
	});
}

JogoDAO.prototype.acao = function(acao, req, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){
			var now = new Date();
			var tempo = null;
			switch (parseInt(acao.acao)) {
				case 1: 
					tempo = 1 * 60 * 60000;
					break;
				case 2:
					tempo = 2 * 60 * 60000;
					break;
				case 3:
					tempo = 5 * 60 * 60000;
					break;
				case 4:
					tempo = 5 * 60 * 60000;
					break;
			}
			acao.acao_termina = now.getTime() + tempo;
			collection.insert(acao);
		});

		mongoclient.collection("jogo", function(err, collection){
			var moedas = null;
			switch (parseInt(acao.acao)) {
				case 1: 
					moedas = -2 * acao.quantidade;
					break;
				case 2:
					moedas = -3 * acao.quantidade;
					break;
				case 3:
					moedas = -1 * acao.quantidade;
					break;
				case 4:
					moedas = -1 * acao.quantidade;
					break;
			}
			collection.update(
				{usuario: acao.usuario},
				{$inc: {moeda: moedas}}
			);
			mongoclient.close();
		});
	});
}

JogoDAO.prototype.getAcoes = function(req, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){
			var now = new Date();
			collection.find({usuario: req.session.usuario, acao_termina: {$gt: now.getTime()}}).toArray(function(err, result){
				res.render('pergaminhos', {acoes: result});
			});
			mongoclient.close();
		});
	});
}

JogoDAO.prototype.revogarAcao = function(id, req, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){
			collection.remove({_id: ObjectID(id)}, function(err, result){
				res.redirect('jogo?msg=revoked_order');
				mongoclient.close();
			});
		});
	});
}

module.exports = function() {
	return JogoDAO;
}
