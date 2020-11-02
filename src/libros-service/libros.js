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
                libroPorSlug(slug: String!): Libro
                librosPorIds(ids: [ID]): [Libro]
                busquedaRapida(busqueda: String!): [Libro]
            }

            type Mutation {
                generarLibrosAleatorios: [Libro]
            }

            type Libro{
                id: ID
                titulo: String
                autor: String
                slug: String
                descripcion: String
                stock: Int
                precio: Float
            }

        `)
    }

    root = {
        libros: async (req) => {
            let resultado = await this.consulta(`SELECT * FROM libros`);
            return resultado;
        },
        librosPorIds: async (req) => {
            console.log(req.ids);
            let resultado = await this.consulta(`SELECT * FROM libros WHERE id IN (${req.ids.join()})`);
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
        generarLibrosAleatorios: async () => {
            let resultadoLibros = await this.consulta(`SELECT * FROM libros`);
            let librosRandomAElegir = [];
            let i = 0;
            while(i < 3){
                let indice = Math.floor(Math.random() * resultadoLibros.length);
                if(!librosRandomAElegir.find(libro => libro.id == resultadoLibros[indice].id)){
                    librosRandomAElegir.push(resultadoLibros[indice])
                    i++;
                }
            }
            await this.consulta(`UPDATE libros SET stock = stock - 1  WHERE id IN (${librosRandomAElegir.map(libro => libro.id).join()})`);
            return librosRandomAElegir;
        },
    };
}

var librosService = new LibrosService();