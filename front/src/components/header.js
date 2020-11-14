import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import AutoSuggest from 'react-autosuggest';
import React from 'react';
import Button from '@material-ui/core/Button';


class Header extends React.Component {
    constructor(){
		super();
		this.state = {
			libros: [],
			sugerencias: [],
			textoAutosuggest: ""
		}
		this.filtrarLibros = this.filtrarLibros.bind(this);
	}

	async componentDidMount(){
		let respuesta = await ConsultaMicroservicioHelper({"query": `query{libros{id titulo slug}}`}, 3002);
		this.setState({
			libros: respuesta.data.libros,
			sugerencias: respuesta.data.libros
		})
	}

	renderSuggestion(suggestion){
		return(
			<span> 
				{suggestion.titulo}
			</span>
		);
	}

	libroNoEncontrado(){
		return(
			<div> 
				Ninguno de nuestros libros coincide con ese título
			</div>
		);
	}

	filtrarLibros(valor){
		let sugerencias = this.state.libros.filter(sugerencia => sugerencia.titulo.includes(valor.value));
		this.setState({
			sugerencias
		})
		return sugerencias;
	}

	render(){
		return (	
			<div className="Header">
					<p className="HeaderPMain">
<<<<<<< HEAD
						<span className="TituloHeader">Book a book</span>
						<AutoSuggest
							suggestions={this.state.sugerencias}
							onSuggestionsFetchRequested={this.filtrarLibros}
							onSuggestionsClearRequested={this.libroNoEncontrado}
							getSuggestionValue={(e, j) => {window.location.href = `/libro/${e.slug}`} }
							renderSuggestion={(suggestion) => this.renderSuggestion(suggestion)}
							inputProps={{placeholder: "Buscá tu libro...", value: this.state.textoAutosuggest, onChange: (e, valor) => this.setState({textoAutosuggest: valor.newValue})}}
						/>
						<Button 
							className="mr-3"
							variant="contained" 
							onClick={() => window.location.href="/perfil"} 
							style={{backgroundColor: "rgb(182, 149, 166)"}} >
=======
						<span className="tituloHeader">Book a book</span>
						<div name="xd">
							<AutoSuggest
								className="autosuggestHeader"
								suggestions={this.state.sugerencias}
								onSuggestionsFetchRequested={this.filtrarLibros}
								onSuggestionsClearRequested={this.libroNoEncontrado}
								getSuggestionValue={(e, j) => {window.location.href = `/libro/${e.slug}`} }
								renderSuggestion={(suggestion) => this.renderSuggestion(suggestion)}
								inputProps={{placeholder: "Buscá tu libro...", value: this.state.textoAutosuggest, onChange: (e, valor) => this.setState({textoAutosuggest: valor.newValue})}}
							/>
						</div>

						<Button variant="contained" onClick={() => window.location.href="/perfil"} style={{backgroundColor: "rgb(182, 149, 66)"}} >
>>>>>>> 7064f93cd62fa13ff4dd57f2b34c65791c566d45
							Ir al perfil
						</Button>
						<Button 
							variant="contained" 
							onClick={() => window.location.href="/vender"} 
							className="botonGenerico"
							style={{backgroundColor: "rgb(100, 80, 178)"}} >
							Vender libro
						</Button>
					</p>
			</div>
		);
	}
}
  
  export default Header;