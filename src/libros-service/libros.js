const MicroservicioBase = require('../../common/helpers/MicroservicioHelper');

class LibrosService extends MicroservicioBase{
    constructor(){
        let puerto = 3002;
        console.log(5, puerto);
        super(puerto);
    }
}

var librosService = new LibrosService();