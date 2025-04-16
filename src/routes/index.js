import cargoRoute from "./cargoRoute.js";
import filmeRoute from "./filmeRoute.js";
import padraoLugarRoute from "./padraoLugarRoute.js";


function Routes(app) {
  cargoRoute(app);
  filmeRoute(app);
  padraoLugarRoute(app);
}

export default Routes;