import React from 'react';
import Header from '../components/header';

class PlantillaPaginaGenerica extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <Header />
                {this.props.children}
            </div>
        );
    }
}

export default PlantillaPaginaGenerica;