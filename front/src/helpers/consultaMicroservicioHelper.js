
export default async function consultarMicroservicio(query, puerto){
    const response = await fetch(`http://localhost:${puerto}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: 'query{libros{id titulo}}'  
    });
    response.json().then((data)=>console.log(9, data))
    return response.json();
}