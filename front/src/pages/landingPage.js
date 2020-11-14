
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import PlantillaPaginaGenerica from '../components/plantillaPaginaGenerica';
import SliderLibros from '../components/sliderLibros';
import { Paper } from '@material-ui/core';
import { Slider } from '@material-ui/core';

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
					<Paper>
					<SliderLibros 
						libros={this.state.libros}
						style="" />
					</Paper>
				</PlantillaPaginaGenerica>
				<div>
					
				</div>
			</div>
		);
	}
}
  
export default Landing;