import React from 'react';

export default class LibroItem extends React.Component {
    constructor(){
        super();
        this.state = {
            libro: null
        }
    }

    componentDidMount(){
        
    }

    render(){
        return(
            <div onClick={() => window.location.href=`/libro/${this.props.libro.slug}`}>
                {this.props.libro.titulo}
            </div>
        );
    }
}