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
                comprarLibro(idUsuario: ID!, idLibroAComprar: ID!): ResultadoCompraVenta
                venderLibro(idUsuario: ID!, libroAVender: InputLibro!): ResultadoCompraVenta
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

            type ResultadoCompraVenta {
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
                    "query": `mutation sumarSaldo($idUsuario: ID!, $monto: Float!) {alterarSaldo(idUsuario: $idUsuario, monto: $monto) {id nombre}}`,
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
        },
        comprarLibro: async (req) => {
            let libroAComprar =  await this.consulta(`SELECT * FROM libros WHERE id IN (${req.idLibroAComprar})`);
            if(libroAComprar[0].stock <= 0){
                return {
                    resultado: false,
                    errores: ["No hay stock para el libro deseado"],
                }
            }
            await this.consulta(`UPDATE libros SET stock = stock - 1  WHERE id IN (${req.idLibroAComprar})`);
            let queryAlterarSaldo =
                {
                    "query": `mutation alterarSaldo($idUsuario: ID!, $monto: Float!) {alterarSaldo(idUsuario: $idUsuario, monto: $monto) {resultado errores{mensaje codigo} usuario{id nombre} }}`,
                    "variables": {
                        "idUsuario": req.idUsuario,
                        "monto": -libroAComprar[0].precio,
                    }
                }
            let resultadoRestarSaldo = await this.consultarMicroservicio(queryAlterarSaldo, 3001);
            console.log(156, resultadoRestarSaldo);
            if(!resultadoRestarSaldo.data.alterarSaldo.resultado){
                if(resultadoRestarSaldo.data.alterarSaldo.errores[0].codigo === 300){
                    return {
                        resultado: false,
                        errores: ["El usuario no cuenta con saldo suficiente"],
                    }
                }
            }
            libroAComprar[0].stock -= 1;
            console.log(165, "Por volver");
            return {
                resultado: true,
                errores: [],
                libro: libroAComprar[0],
            } 
        }
    };
}

var librosService = new LibrosService();