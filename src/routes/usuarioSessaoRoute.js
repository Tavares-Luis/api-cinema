import usuarioSessaoController from "../controllers/usuarioSessaoController.js";



export default (app) => {
  app.get('/usuarioSessao', usuarioSessaoController.get);
  app.get('/usuarioSessao/:id', usuarioSessaoController.get);
  app.get('/usuarioSessao/usuario/:id', usuarioSessaoController.getLugaresLivres);
  app.get('/usuarioSessao/usuario/comprar/:id', usuarioSessaoController.listarUsuarioSessao);
  app.post('/usuarioSessao', usuarioSessaoController.persist);
  app.post('/usuarioSessao/usuario/comprar', usuarioSessaoController.comprarIngresso);
  app.patch('/usuarioSessao/:id', usuarioSessaoController.persist);
  app.delete('/usuarioSessao/:id', usuarioSessaoController.destroy);
  app.delete('/usuarioSessao/usuario/cancelar/:id', usuarioSessaoController.cancelarIngresso);
};