import LibroItem from './libroItem';
import React, { useState } from 'react';

export default function SliderLibros(props) {
    const [pagina, setPagina] = useState(0);
    return(
        <div>
            {
                props.libros.map((libro, index) =>{
                    if(index < pagina + 3 && index >= pagina)
                    return(
                        <div>
                            <LibroItem libro={libro}/>
                        </div>
                    );
                })
            }
            <div onClick={() => setPagina(pagina != 0 ? pagina - 1: pagina)} >
                {"<-"}
            </div>
            <div onClick={() => setPagina(pagina < (props.libros.length - 1) /3 ? pagina + 1: pagina)}>
                {"->"}
            </div>
        </div>
    );
}