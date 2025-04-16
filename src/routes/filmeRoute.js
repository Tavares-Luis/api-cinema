import filmeController from "../controllers/filmeController";

export default (app) => {

    app.get('./filme', filmeController.get);
    app.get('./filme/:id', filmeController.get);
    app.post('./filme', filmeController.persist);
    app.patch('./filme/:id', filmeController.persist);
    app.delete('./filme/:id', filmeController.destroy);

};