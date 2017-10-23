module.exports.jogo = function(application, req, res) {
	if (req.session.autorizado !== true) {
		res.render('index', {validacao: {}});
		return;
	}

	var msg = null;
	switch (req.query.msg) {
		case 'suditos_failed':
			msg = {alert: 'alert-danger', msg: 'Operação inválida, verifique se todos os campos foram informados!'};
			break;
		case 'suditos_success':
			msg = {alert: 'alert-success', msg: 'Ação incluida com sucesso'};
			break;
		case 'finish_activity':
			msg = {alert: 'alert-info', msg: 'Senhor, a atividade ordenada foi finalizada'};
			break;
	}

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	JogoDAO.iniciaJogo(msg, req, res);
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

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	JogoDAO.getAcoes(req, res);
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
		res.redirect('jogo?msg=suditos_failed');
		return;
	}

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	dadosForm.usuario = req.session.usuario;
	JogoDAO.acao(dadosForm, req, res);

	res.redirect('jogo?msg=suditos_success');
}