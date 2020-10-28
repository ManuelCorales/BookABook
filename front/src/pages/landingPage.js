
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';

class Landing extends React.Component {
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
			  	<header className="App-header">
					<p>
					<Button variant="contained" color="primary" onClick={() => ConsultaMicroservicioHelper(null, 3002)}>
						un botón
					</Button>
					Estas en el landing
					</p>
			  	</header>
			</div>
		);
	}
}
  
  export default Landing;