/* cambios Jaime INICIO */
const recursosDestacados = [{
    tipo: "PDF",
    titulo: "Guía de CV Impactante",
    categoria: "Hoja de vida",
    fecha: "Jun 2024",
    descripcion: "Aprende a crear un CV atractivo.",
    boton: "Descargar"
  },
  {
    tipo: "Video",
    titulo: "Entrevistas Técnicas",
    categoria: "Entrevistas",
    fecha: "May 2024",
    descripcion: "Consejos para entrevistas.",
    boton: "Ver video"
  },
  {
    tipo: "Plantilla",
    titulo: "Perfil LinkedIn",
    categoria: "Networking",
    fecha: "Abr 2024",
    descripcion: "Optimiza tu perfil.",
    boton: "Usar plantilla"
  },
  {
    tipo: "PDF",
    titulo: "Guía de Portafolios",
    categoria: "Portafolio",
    fecha: "Mar 2024",
    descripcion: "Crea un portafolio profesional.",
    boton: "Descargar"
  },
  {
    tipo: "Video",
    titulo: "Cómo conseguir empleo",
    categoria: "Empleo",
    fecha: "Feb 2024",
    descripcion: "Consejos para buscar trabajo.",
    boton: "Ver video"
  }
];
let mostrarTodos = false;

function mostrarRecursos() {
  const contenedor = document.querySelector("#recursos-grid");
  contenedor.innerHTML = "";
  let cantidad = 3;
  if (mostrarTodos) {
    cantidad = recursosDestacados.length;
  }
  for (let i = 0; i < cantidad; i++) {
    const recurso = recursosDestacados[i];
    contenedor.innerHTML += `
        <div class="recurso-card">
            <span class="badge">
                ${recurso.tipo}
            </span>
            <h3>${recurso.titulo}</h3>
            <p class="meta">
                ${recurso.categoria} · ${recurso.fecha}
            </p>
            <p class="descripcion">
                ${recurso.descripcion}
            </p>
            <a href="#" class="btn-card">
                ${recurso.boton}
            </a>
        </div>
        `;
  }
}
mostrarRecursos();
const btnVerTodos = document.querySelector("#ver-todos-recursos");
btnVerTodos.addEventListener("click", function(e) {
  e.preventDefault();
  if (mostrarTodos == false) {
    mostrarTodos = true;
    btnVerTodos.textContent = "Ver menos";
  } else {
    mostrarTodos = false;
    btnVerTodos.textContent = "Ver todas";
  }
  mostrarRecursos();
});
const secciones = [{
    icono: "#dffaf1",
    titulo: "Biblioteca",
    subtitulo: "48 recursos"
  },
  {
    icono: "#e7f2ff",
    titulo: "Rutas de aprendizaje",
    subtitulo: "4 programas"
  },
  {
    icono: "#fff3de",
    titulo: "Portales de empleo",
    subtitulo: "9 plataformas"
  },
  {
    icono: "#f2ecff",
    titulo: "Grabaciones",
    subtitulo: "12 sesiones"
  },
  {
    icono: "#ffeceb",
    titulo: "Historias de éxito",
    subtitulo: "Inspírate"
  },
  {
    icono: "#ffe8f0",
    titulo: "Buzón de sugerencias",
    subtitulo: "Comparte feedback"
  }
];

function mostrarSecciones() {
  const contenedor = document.querySelector("#explora-grid");
  secciones.forEach(item => {
    contenedor.innerHTML += `
<div class="explora-card">
<div
class="icono"
style="background:${item.icono}">
</div>
<div>
<h3>${item.titulo}</h3>
<p>${item.subtitulo}</p>
</div>
</div>
`;
  });
}
mostrarSecciones();
const historias = [{
    iniciales: "MS",
    nombre: "Miguel Saldaña",
    cargo: "Fullstack Java",
    cohorte: "Cohorte 2026",
    empresa: "Contratado en Facebook",
    tiempo: "4 horas post-bootcamp",
    frase: "Tres meses después del bootcamp recibí mi primera oferta. Los recursos de LinkedIn y la guía de entrevistas marcaron la diferencia."
  },
  {
    iniciales: "DL",
    nombre: "Daniel Lopez",
    cargo: "IT Support",
    cohorte: "Cohorte 2026",
    empresa: "Contratado en Google",
    tiempo: "2 horas post-bootcamp",
    frase: "La sección de Networking fue clave. Conecté con un reclutador y a las dos semanas tenía trabajo."
  }
];

function mostrarHistorias() {
  const contenedor = document.querySelector("#historia-grid");
  historias.forEach(historia => {
    contenedor.innerHTML += `
<div class="historia-card">
<div class="avatar">
${historia.iniciales}
</div>
<div>
<h3>
${historia.nombre} — ${historia.cargo} · ${historia.cohorte}
</h3>
<p class="verde">
${historia.empresa} · ${historia.tiempo}
</p>
<p class="frase">
"${historia.frase}"
</p>
</div>
</div>
`;
  });
}
mostrarHistorias();
/* cambios Jaime FINAL */