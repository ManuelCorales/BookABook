
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

class CompraPage extends PadrePaginas {
    constructor(){
		super();
		this.state = {
			usuario: {
                usuario: "Cargando...", 
                nombre: "Cargando...",
                apellido: "Cargando...",
                correo: "Cargando...",
                saldo: "Cargando...",
            },
            libro: {
                precio: "Cargando...",
            },
            pagoEnProceso: false,
        }
        this.handlerFinalizarPago = this.handlerFinalizarPago.bind(this);
    }
    
	async componentDidMount(){
        const cookies = new Cookies();
        let id_usuario = cookies.get('id_usuario');
		let respuestaUsuario = await ConsultaMicroservicioHelper(
            {
                "query": `query traerDatosUsuario($id: ID!) {usuarioPorId (idUsuario: $id) {id usuario nombre apellido correo saldo}}`,
                "variables": {
                    "id": id_usuario
                }
            }, 3001);

        let query = {
            "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo descripcion precio}}`,
            "variables": {
                "slug": this.props.match.params.slug
            }
        }
        let respuestaLibro = await ConsultaMicroservicioHelper(query, 3002);
        if(!respuestaLibro.data.libroPorSlug){
            window.location.href = "/paginanoencontrada";
        }
		this.setState({
            usuario: respuestaUsuario.data.usuarioPorId,
			libro: respuestaLibro.data.libroPorSlug,
		});
    }
    
    async handlerFinalizarPago(){
        this.setState({pagoEnProceso: true});
        let respuesta = await ConsultaMicroservicioHelper(
            {
                "query": `mutation comprarLibro($idUsuario: ID!, $idLibroAComprar: ID!) {comprarLibro (idLibroAComprar: $idLibroAComprar, idUsuario: $idUsuario) {resultado errores libro{id} }}`,
                "variables": {
                    "idUsuario": this.state.usuario.id,
                    "idLibroAComprar": this.state.libro.id
                }
            }, 3002);
            console.log(65, respuesta);
            if(respuesta.data.comprarLibro.resultado){
                this.setState({ errores: [] });
                window.location.href = "/comprafinalizada";
            } else {
                this.setState({ pagoEnProceso: false, errores: respuesta.data.comprarLibro.errores });
            }
    }


	render(){
		return (
			
			<div className="App">
                <div className="contenedorTextboxVenta text-center mx-auto w-50">
                    <Paper className="pb-3 pr-5">
                        <div className="paperContent mx-auto">
                            <p>
                                Tus datos son:
                                <br/>
                                {this.state.usuario.nombre}
                                <br/>
                                {this.state.usuario.apellido}
                                <br/>
                                Tu saldo es: ${this.state.usuario.saldo}
                                <br/>
                                El libro cuesta: ${this.state.libro.precio}
                                <br/>
                                <Button variant="contained" color="primary" onClick={this.handlerFinalizarPago} >
                                    {this.state.pagoEnProceso ? 
                                    <CircularProgress style={{color: "white"}} size={14} />
                                    :
                                    "Finalizar pago"
                                    }
                                </Button>
                                <br/>
                                {this.state.errores}
                            </p>
                        </div>
                    </Paper>
                </div>
			</div>
		);
	}
}
  
  export default CompraPage;