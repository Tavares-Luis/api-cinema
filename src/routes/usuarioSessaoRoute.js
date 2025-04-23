import usuarioSessaoController from "../controllers/usuarioSessaoController.js";



export default (app) => {
  app.get('/usuarioSessao', usuarioSessaoController.get);
  app.get('/usuarioSessao/:id', usuarioSessaoController.get);
  app.post('/usuarioSessao', usuarioSessaoController.persist);
  app.patch('/usuarioSessao/:id', usuarioSessaoController.persist);
  app.delete('/usuarioSessao/:id', usuarioSessaoController.destroy);
  app.get('/usuarioSessao/usuario/:id', usuarioSessaoController.getLugaresLivres);
  app.post('/usuarioSessao/usuario/comprar', usuarioSessaoController.comprarIngresso);
  app.delete('/usuarioSessao/usuario/cancelar/:id', usuarioSessaoController.cancelarIngresso);
};