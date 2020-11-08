
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';

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
		}
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


	render(){
		return (
			
			<div className="App">
					<header className="App-header">
						<p>
						    Tus datos son:
                            <br/>
                            {this.state.usuario.nombre}
                            <br/>
                            {this.state.usuario.apellido}
                            <br/>
                            Tu saldo es:
                            {this.state.usuario.saldo}
                            <br/>
                            El libro cuesta:
                            {this.state.libro.precio}
						</p>
					</header>
			</div>
		);
	}
}
  
  export default CompraPage;