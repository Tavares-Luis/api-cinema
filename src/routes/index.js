import cargoRoute from "./cargoRoute.js";
import filmeRoute from "./filmeRoute.js";
import padraoLugarRoute from "./padraoLugarRoute.js";
import parametroRoute from "./parametroRoute.js";
import salaRoute from "./salaRoute.js";
import sessaoRoute from "./sessaoRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import usuarioSessaoRoute from "./usuarioSessaoRoute.js";


function Routes(app) {
  
  cargoRoute(app);
  filmeRoute(app);
  padraoLugarRoute(app);
  usuarioRoute(app);
  salaRoute(app);
  sessaoRoute(app);
  usuarioSessaoRoute(app);
  parametroRoute(app);

};

export default Routes;