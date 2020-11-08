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
                venderLibro(idUsuario: ID!, libroAVender: InputLibro!): ResultadoVenta
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

            input InputLibro {
                id: ID
                titulo: String
                autor: String
                slug: String
                descripcion: String
                stock: Int
                precio: Float
                esUsado: Boolean
            }

            type ResultadoVenta {
                resultado: Boolean
                errores: [String]
                libro: Libro
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
        venderLibro: async(req) => {
            const libro = req.libroAVender
            if("titulo" in libro && "autor" in libro && "descripcion" in libro){
                for(const dato in libro){
                    if(dato.length === 0){
                        return {
                            resultado: false,
                            errores: ["Complete los todos los campos"],
                        }
                    }
                }
                let parametros = [];
                let columnas = []
                let resultadoVerificacionRepetido = await this.consulta(`SELECT * FROM libros WHERE titulo = '${libro.titulo}'`);
                if(resultadoVerificacionRepetido.length > 0){
                    return {
                        resultado: false,
                        errores: ["Libro ya registrado"],
                    }
                }
                for(let propiedad in libro){
                    columnas.push(propiedad);
                    if(libro[propiedad] === true) {
                        libro[propiedad] = 1;
                    } else if (libro[propiedad] === false) {
                        libro[propiedad] = 0;
                    }
                    parametros.push(`'${libro[propiedad]}'`);
                }

                let resultado = await this.consulta(`INSERT INTO libros (${columnas.join()}) VALUES(${parametros.join()}) `);
                let libroCreado  = await this.consulta(`SELECT * FROM libros WHERE id=${resultado.insertId}`);
                let querySumarSaldo =
                {
                    "query": `mutation sumarSaldo($idUsuario: ID!, $monto: Float!) {sumarSaldo(idUsuario: $idUsuario, monto: $monto) {id nombre}}`,
                    "variables": {
                        "idUsuario": req.idUsuario,
                        "monto": 50,
                    }
                }
                await this.consultarMicroservicio(querySumarSaldo, 3001);
                return {
                    resultado: true,
                    libro: libroCreado[0],
                    errores: [],
                }
            } else {
                return {
                    resultado: false,
                    errores: ["Complete todos los campos"],
                }
            }
        }
    };
}

var librosService = new LibrosService();