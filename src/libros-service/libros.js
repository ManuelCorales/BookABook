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
                busquedaRapida(busqueda: String): [Libro] 
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
        busquedaRapida: async (req) => {
            let resultado = this.consulta(`SELECT * FROM libros WHERE titulo LIKE '${req.busqueda}'`);
            return resultado;
        },
        mensajePrueba: () => {
            return "xd"
        },
    };
}

var librosService = new LibrosService();