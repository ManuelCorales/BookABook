const MicroservicioBase = require('../../common/helpers/MicroservicioHelper');

class LibrosService extends MicroservicioBase{
    constructor(){
        let puerto = 3002;
        super(puerto);
        this.initGraphQL(puerto, this.schema(), this.root)
    }

    schema(){
        return(`
            type Query {
                libros: [Libro]
                mensajePrueba: String
            }

            type Libro{
                id: ID
                titulo: String
                autor: String
                descripcion: String
                stock: Int
                precio: Float
            }
        `)
    }

    root = {
        libros: async () => {
            let resultado = this.consulta(`SELECT * FROM libros`);
            return resultado;
        },
        mensajePrueba: () => {
            return "xd"
        },
    };
}

var librosService = new LibrosService();