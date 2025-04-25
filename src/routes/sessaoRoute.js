import sessaoController from "../controllers/sessaoController.js";
import clienteMiddleware from "../middlewares/clienteMiddleware.js";


export default (app) => {
  app.get('/sessao', clienteMiddleware, sessaoController.get);
  app.get('/sessao/:id', sessaoController.get);
  app.get('/sessao/feedback/:id', sessaoController.getFeedback)
  app.post('/sessao', sessaoController.persist);
  app.patch('/sessao/:id', sessaoController.persist);
  app.delete('/sessao/:id', sessaoController.destroy);
};