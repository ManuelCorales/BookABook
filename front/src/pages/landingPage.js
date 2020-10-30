
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import PlantillaPaginaGenerica from '../components/plantillaPaginaGenerica';

class Landing extends PadrePaginas {
    constructor(){
		super();
		this.state = {
			libros: [],
		}
	}

	async componentDidMount(){
		let respuesta = await ConsultaMicroservicioHelper({"query": `query{libros{id titulo slug}}`}, 3002);
		this.setState({
			libros: respuesta.data.libros,
			sugerencias: respuesta.data.libros
		})
	}


	render(){
		return (
			
			<div className="App">
				<PlantillaPaginaGenerica>
					<header className="App-header">
						<p>
						<Button variant="contained" color="primary" onClick={() => ConsultaMicroservicioHelper(null, 3002)}>
							un botón
						</Button>
						Estas en el landing
						</p>
					</header>
				</PlantillaPaginaGenerica>
			</div>
		);
	}
}
  
  export default Landing;