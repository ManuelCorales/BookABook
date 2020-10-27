
export default async function consultarMicroservicio(query, puerto){
    const response = await fetch(`http://localhost:${puerto}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{ "query": "query{libros{id titulo}}" }'
    });
    let respuesta = await response.json().then((data)=> data);
    return respuesta;
}