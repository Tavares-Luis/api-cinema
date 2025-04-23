import padraoLugarController from "../controllers/padraoLugarController.js";

export default (app) => {

    app.get('/padraoLugar', padraoLugarController.get);
    app.get('/padraoLugar/:id', padraoLugarController.get);
    app.post('/padraoLugar', padraoLugarController.persist);
    app.patch('/padraoLugar/:id', padraoLugarController.persist);
    app.delete('/padraoLugar/:id', padraoLugarController.destroy);

};