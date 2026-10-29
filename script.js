
const formulario = document.getElementById("formDocente");
const tabla = document.getElementById("tablaDocentes");

let docentes = JSON.parse(
    localStorage.getItem("docentes")
) || [];

let editando = null;

mostrarDocentes();

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const numero = document.getElementById("numero").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();

    if (!numero || !nombre || !especialidad) {
        alert("Completa todos los campos");
        return;
    }

    if (editando === null) {

        const existe = docentes.some(
            docente => docente.numero === numero
        );

        if (existe) {
            alert("El número de empleado ya existe");
            return;
        }

        docentes.push({
            numero,
            nombre,
            especialidad
        });

    } else {

        docentes[editando] = {
            numero,
            nombre,
            especialidad
        };

        editando = null;
    }

    mostrarDocentes();
    formulario.reset();

});

function mostrarDocentes() {

    tabla.innerHTML = "";
    localStorage.setItem(
        "docentes",
        JSON.stringify(docentes)
    );

    docentes.forEach(function(docente, indice) {

        const fila = document.createElement("tr");

        const datos = [
            docente.numero,
            docente.nombre,
            docente.especialidad
        ];

        datos.forEach(function(dato) {

            const celda = document.createElement("td");

            celda.textContent = dato;

            fila.appendChild(celda);

        });

        const acciones = document.createElement("td");

        const botonEditar = document.createElement("button");

        botonEditar.textContent = "Editar";

        botonEditar.onclick = function() {
            editarDocente(indice);
        };

        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";

        botonEliminar.onclick = function() {
            eliminarDocente(indice);
        };

        acciones.appendChild(botonEditar);
        acciones.appendChild(botonEliminar);

        fila.appendChild(acciones);

        tabla.appendChild(fila);

    });

}

function editarDocente(indice) {

    const docente = docentes[indice];

    document.getElementById("numero").value = docente.numero;
    document.getElementById("nombre").value = docente.nombre;
    document.getElementById("especialidad").value = docente.especialidad;

    editando = indice;

}

function eliminarDocente(indice) {

    const confirmar = confirm(
        "¿Deseas eliminar este docente?"
    );

    if (confirmar) {

        docentes.splice(indice, 1);

        mostrarDocentes();

    }

}

function descargarArchivo(contenido, nombre, tipo) {
    const archivo = new Blob(
        [contenido],
        { type: tipo + ";charset=utf-8;" }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = nombre;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escaparXML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function exportarXML() {
    const registros = docentes.map(docente => `
    <docente>
        <numero>${escaparXML(docente.numero)}</numero>
        <nombre>${escaparXML(docente.nombre)}</nombre>
        <especialidad>${escaparXML(docente.especialidad)}</especialidad>
    </docente>`).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<docentes>${registros}
</docentes>`;

    descargarArchivo(xml, "docentes.xml", "application/xml");
}

function exportarJSON() {
    const json = JSON.stringify(docentes, null, 2);

    descargarArchivo(
        json,
        "docentes.json",
        "application/json"
    );
}

function exportarYAML() {
    if (typeof jsyaml === "undefined") {
        alert("No se pudo cargar la biblioteca YAML. Revisa tu conexión a Internet.");
        return;
    }

    const yaml = jsyaml.dump(docentes, {
        noRefs: true,
        forceQuotes: true
    });

    descargarArchivo(
        yaml,
        "docentes.yaml",
        "text/yaml"
    );
}

document.getElementById("exportarTodos")
    .addEventListener("click", function() {
        exportarXML();
        exportarJSON();
        exportarYAML();

        alert("Se solicitaron las descargas XML, JSON y YAML.");
    });
