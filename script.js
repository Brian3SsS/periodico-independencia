const paginas = document.querySelectorAll(".pagina");
const siguiente = document.getElementById("siguiente");
const anterior = document.getElementById("anterior");
const contador = document.getElementById("contador");
const libro = document.getElementById("libro");

let paginaActual = 0;
let inicioX = 0;
let finX = 0;
let animando = false;

function ajustarAltura() {
    const pagina = paginas[paginaActual];

    if (pagina) {
        libro.style.height = `${pagina.scrollHeight}px`;
    }
}

function mostrarPagina(nuevaPagina, direccion) {
    if (
        animando ||
        nuevaPagina < 0 ||
        nuevaPagina >= paginas.length ||
        nuevaPagina === paginaActual
    ) {
        return;
    }

    animando = true;

    const paginaVieja = paginas[paginaActual];
    const paginaNueva = paginas[nuevaPagina];

    paginaNueva.style.zIndex = 10;
    paginaVieja.style.zIndex = 5;

    paginaNueva.classList.add("activa");

    if (direccion === "siguiente") {
        paginaVieja.classList.add("saliendo");
    } else {
        paginaVieja.style.transform = "rotateY(180deg)";
        paginaNueva.style.transform = "rotateY(0deg)";
    }

    setTimeout(() => {
        paginaVieja.classList.remove("activa", "saliendo");
        paginaVieja.style.transform = "";
        paginaNueva.style.transform = "";

        paginaNueva.classList.add("activa");

        paginaActual = nuevaPagina;

        contador.textContent = `${paginaActual + 1} / ${paginas.length}`;

        actualizarBotones();
        ajustarAltura();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        animando = false;
    }, 850);
}

function actualizarBotones() {
    anterior.disabled = paginaActual === 0;
    siguiente.disabled = paginaActual === paginas.length - 1;
}

siguiente.addEventListener("click", () => {
    mostrarPagina(paginaActual + 1, "siguiente");
});

anterior.addEventListener("click", () => {
    mostrarPagina(paginaActual - 1, "anterior");
});

libro.addEventListener("touchstart", (evento) => {
    inicioX = evento.changedTouches[0].screenX;
});

libro.addEventListener("touchend", (evento) => {
    finX = evento.changedTouches[0].screenX;
    detectarDeslizamiento();
});

libro.addEventListener("mousedown", (evento) => {
    inicioX = evento.clientX;
});

libro.addEventListener("mouseup", (evento) => {
    finX = evento.clientX;
    detectarDeslizamiento();
});

function detectarDeslizamiento() {
    const diferencia = inicioX - finX;

    if (Math.abs(diferencia) < 50) {
        return;
    }

    if (diferencia > 0) {
        mostrarPagina(paginaActual + 1, "siguiente");
    } else {
        mostrarPagina(paginaActual - 1, "anterior");
    }
}

document.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowRight") {
        mostrarPagina(paginaActual + 1, "siguiente");
    }

    if (evento.key === "ArrowLeft") {
        mostrarPagina(paginaActual - 1, "anterior");
    }
});

window.addEventListener("resize", ajustarAltura);

window.addEventListener("load", () => {
    actualizarBotones();
    ajustarAltura();
});