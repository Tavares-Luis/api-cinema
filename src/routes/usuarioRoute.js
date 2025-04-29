import usuarioController from "../controllers/usuarioController.js";
import loginMiddleware from "../middlewares/loginMiddleware.js";


export default (app) => {
  app.get('/usuario/info-by-token', loginMiddleware, usuarioController.getDataByToken);
  app.get('/usuario', usuarioController.get);
  app.get('/usuario/:id', usuarioController.get);
  app.post('/usuario', usuarioController.persist);
  app.post('/usuario/login', usuarioController.login);
  app.post('/usuario/forgot-password', usuarioController.forgotPassword);
  app.post('/usuario/reset-password', usuarioController.resetPassword);
  app.patch('/usuario/:id', usuarioController.persist);
  app.delete('/usuario/:id', usuarioController.destroy);
};