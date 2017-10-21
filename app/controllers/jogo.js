module.exports.jogo = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}

	var comando_invalido = 'N';
	if (req.query.comando_invalido == 'S') {
		comando_invalido = 'S';
	}

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	JogoDAO.iniciaJogo(req, res, comando_invalido);
}

module.exports.sair = function(application, req, res) {
	req.session.destroy(function(err){
		res.render('index', {validacao: {}});
	});
}

module.exports.suditos = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}

	res.render('aldeoes', {validacao: {}});
}

module.exports.pergaminhos = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}

	res.render('pergaminhos', {validacao: {}});
}

module.exports.ordenar_acao_sudito = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}
	
	var dadosForm = req.body;

	req.assert('acao', 'Ação deve ser informada').notEmpty();
	req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

	var erros = req.validationErrors();

	if(erros) {
		res.redirect('jogo?comando_invalido=S');
		return;
	}

	res.send('tudo ok');
}