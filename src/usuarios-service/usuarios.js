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
                registrarUsuario(datosRegistro: InputUsuarioRegistro): RespuestaValidacion
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
            }

            type RespuestaValidacion{
                resultado: Boolean
                usuario: Usuario
                errores: [String]
            }

        `)
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
                        usuario: usuarioCreado[0],
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
                    usuario: resultado[0],
                }
            }
        },
        usuarioPorId: async (req) => {
            let resultado = await this.consulta(`SELECT * FROM usuarios WHERE id = '${req.idUsuario}'`);
            return resultado[0];
        },
    };
}

var usuariosService = new UsuariosService();