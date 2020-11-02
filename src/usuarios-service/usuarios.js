const MicroservicioBase = require('../../common/helpers/MicroservicioHelper');

class UsuariosService extends MicroservicioBase{
    constructor(){
        let puerto = 3001;
        super(puerto);
        this.initGraphQL(puerto, this.schema(), this.root)
    }

    schema(){
        return(`
            type Query {
                usuarioPorId(idUsuario: ID!): Usuario
                validarLogin(datosLogin: InputDatosLogin): RespuestaValidacion
                registrarUsuario(datosRegistro: InputUsuarioRegistro!): RespuestaValidacion
            }

            type Mutation {
                guardarUsuario(usuario: InputUsuario!): Usuario
                habilitarSuscripcion(idUsuario: ID!): Usuario
            }

            input InputUsuario {
                id: ID
                usuario: String
                nombre: String
                apellido: String
                correo: String
                DNI: Int
                numeroDeTarjeta: Int
                estasuscripto: Boolean
            }

            type Usuario{
                id: ID
                usuario: String
                nombre: String
                apellido: String
                correo: String
                DNI: Int
                numeroDeTarjeta: Int
                estasuscripto: Boolean
                libros: [Libro]
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

            input InputDatosLogin {
                usuario: String
                password: String
            }
            
            input InputUsuarioRegistro{
                usuario: String
                password: String
                nombre: String
                apellido: String
                correo: String
                dni: Int
                estasuscripto: Boolean
                numerotarjeta: Int
            }

            type RespuestaValidacion{
                resultado: Boolean
                usuario: Usuario
                errores: [String]
            }

        `)
    }

    bindUsuario(usuario){
        usuario.libros = async () => {
            let resultadoLibros = await this.consulta(`SELECT * FROM usuario_librossuscripcion WHERE id_usuario = ${usuario.id}`);
            console.log(84, resultadoLibros);
            if(resultadoLibros.length != 0){
                let queryDeUsuario =
                {
                    "query": `query librosPorIds($ids: [ID]) {librosPorIds(ids: $ids){id titulo autor slug descripcion stock}}`,
                    "variables": {
                        "ids": resultadoLibros.map(libro => libro.id_libro)
                    }
                }
                console.log(93, resultadoLibros.map(libro => libro.id_libro));
                let librosAleatorios = await this.consultarMicroservicio(queryDeUsuario, 3002);
                console.log(94, librosAleatorios.data.librosPorIds);
                return librosAleatorios.data.librosPorIds;
            } else {
                console.log(97, "Entré");
                return [];
            }
        }
        return usuario;
    }

    root = {
        registrarUsuario: async (req) => {
            const datosRegistro = req.datosRegistro
            if("usuario" in datosRegistro && "password" in datosRegistro && "nombre" in datosRegistro && "apellido" in datosRegistro && "correo" in datosRegistro && "dni" in datosRegistro){
                for(const dato in datosRegistro){
                    if(dato.length === 0){
                        return {
                            resultado: false,
                            errores: ["Complete los todos los campos"],
                        }
                    }
                }
                let resultado = await this.consulta(`SELECT * FROM usuarios WHERE usuario='${datosRegistro.usuario}' OR correo='${datosRegistro.correo}' `);
                if(resultado.length === 0){
                    let resultado = await this.consulta(`INSERT INTO usuarios (usuario, nombre, password, apellido, correo, dni, estasuscripto, numerotarjeta) VALUES('${datosRegistro.usuario}', '${datosRegistro.nombre}', '${datosRegistro.password}', '${datosRegistro.apellido}', '${datosRegistro.correo}', ${datosRegistro.dni}, 1, 7000) `);
                    let usuarioCreado  = await this.consulta(`SELECT * FROM usuarios WHERE id=${resultado.insertId}`);
                    return {
                        resultado: true,
                        usuario: this.bindUsuario(usuarioCreado[0]),
                        errores: [],
                    }
                } else {
                    return {
                        resultado: false,
                        errores: [(resultado[0].usuario === datosRegistro.usuario ? "Ese nombre de usuario ya fue registrado": "Ese correo ya fue registrado")],
                    }
                }
            } else {
                return {
                    resultado: false,
                    errores: ["Complete los todos los campos"],
                }
            }
        },

        validarLogin: async (req) => {
            if(req.datosLogin.usuario.length === 0 || req.datosLogin.password.length === 0){
                return {
                    resultado: false,
                    errores: ["Complete los todos los campos"],
                }
            }
            let resultado = await this.consulta(`SELECT * FROM usuarios WHERE usuario='${req.datosLogin.usuario}' AND password='${req.datosLogin.password}' `);
            if(resultado.length === 0){
                return {
                    resultado: false,
                    errores: ["El usuario o password son incorrectos"],
                }
            } else {
                return {
                    resultado: true,
                    errores: [],
                    usuario: this.bindUsuario(resultado[0]),
                }
            }
        },
        usuarioPorId: async (req) => {
            let resultado = await this.consulta(`SELECT * FROM usuarios WHERE id = '${req.idUsuario}'`);
            return this.bindUsuario(resultado[0]);
        },
        guardarUsuario: async (req) => {
            let propiedades = [];
            let resultado = await this.consulta(`SELECT * FROM usuarios WHERE id=${req.usuario.id}`);
            for(let propiedad in resultado[0]){
                if(propiedad != 'id'){
                    if(req.usuario[propiedad] === true)
                        req.usuario[propiedad] = 1;
                    else if(req.usuario[propiedad] === false)
                        req.usuario[propiedad] = 0;
                    propiedades.push(`${propiedad}='${req.usuario[propiedad] ? req.usuario[propiedad] : resultado[0][propiedad] }'`);
                }
            }
            await this.consulta(`UPDATE usuarios SET ${propiedades.join()} WHERE id=${req.usuario.id}`);
            let resultadoADevolver = await this.consulta(`SELECT * FROM usuarios WHERE id=${req.usuario.id}`);
            return this.bindUsuario(resultadoADevolver[0]); 
        },
        habilitarSuscripcion: async (req) => {
            let propiedades = [];
            let resultado = await this.consulta(`SELECT * FROM usuarios WHERE id=${req.idUsuario}`);
            for(let propiedad in resultado[0]){
                if(propiedad != 'id'){
                    if(propiedad == "estasuscripto") resultado[0][propiedad] = 1;
                    propiedades.push(`${propiedad}='${resultado[0][propiedad]}'`);
                }
            }
            await this.consulta(`UPDATE usuarios SET ${propiedades.join()} WHERE id=${req.idUsuario}`);

            let queryLibrosAleatorios =
            {
                "query": `mutation generarLibrosAleatorios{generarLibrosAleatorios {id titulo}}`,
            }
            let librosAleatorios = await this.consultarMicroservicio(queryLibrosAleatorios, 3002);
            let stringsInsert = [];
            for(let libro of librosAleatorios.data.generarLibrosAleatorios){
                stringsInsert.push(`(${req.idUsuario}, ${libro.id})`)
            }
            await this.consulta(`INSERT INTO usuario_librossuscripcion (id_usuario, id_libro) VALUES ${stringsInsert.join()};`);
            let resultadoADevolver = await this.consulta(`SELECT * FROM usuarios WHERE id=${req.idUsuario}`);
            return this.bindUsuario(resultadoADevolver[0]); 
        }
    };
}

var usuariosService = new UsuariosService();