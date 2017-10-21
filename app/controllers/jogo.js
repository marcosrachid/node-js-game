module.exports.jogo = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	JogoDAO.iniciaJogo(req, res);
}

module.exports.sair = function(application, req, res) {
	req.session.destroy(function(err){
		res.render('index', {validacao: {}});
	});
}

module.exports.suditos = function(application, req, res) {
	res.render('aldeoes', {validacao: {}});
}

module.exports.pergaminhos = function(application, req, res) {
	res.render('pergaminhos', {validacao: {}});
}