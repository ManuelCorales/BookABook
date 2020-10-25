const MicroservicioBase = require('../../common/helpers/MicroservicioHelper');

class UsuariosService extends MicroservicioBase{
    constructor(){
        let puerto = 3001;
        console.log(5, puerto);
        super(puerto);
    }
}

var usuariosService = new UsuariosService();