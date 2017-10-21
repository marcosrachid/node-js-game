module.exports.cadastro = function(application, req, res) {
	res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res) {

	var dadosForm = req.body;

	req.assert('nome', 'Nome não pode ser vazio').notEmpty();
	req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
	req.assert('senha', 'Senha não pode ser vazia').notEmpty();
	req.assert('casa', 'Casa não pode ser vazia').notEmpty();

	var erros = req.validationErrors();

	if (erros) {
		res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
		return;
	}

	var connection = application.config.dbConnection;
	var UsuariosDAO = new application.app.models.dao.UsuariosDAO(connection);
	var JogoDAO = new application.app.models.dao.JogoDAO(connection);

	UsuariosDAO.inserirUsuario(dadosForm, req, res);
	JogoDAO.gerarParametros(dadosForm.usuario);

	req.session.autorizado = true;
	req.session.usuario = dadosForm.usuario;
	req.session.casa = dadosForm.casa;
	res.redirect('jogo');
}