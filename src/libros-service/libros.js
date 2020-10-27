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
                busquedaRapida(busqueda: String!): [Libro]
                libroPorSlug(slug: String!): Libro
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
            let resultado = await this.consulta(`SELECT * FROM libros`);
            return resultado;
        },
        busquedaRapida: async (req) => {
            let resultado = await this.consulta(`SELECT * FROM libros WHERE titulo OR autor LIKE '%${req.busqueda}%'`);
            return resultado;
        },
        libroPorSlug: async (req) => {
            let resultado = await this.consulta(`SELECT * FROM libros WHERE slug = '${req.slug}'`);
            return resultado[0];
        },
        mensajePrueba: () => {
            return "xd"
        },
    };
}

var librosService = new LibrosService();