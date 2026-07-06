const programTabList = document.querySelector('#program-tab-list');
const contentRoutesCards = document.querySelector('.content__routes__route')

const trainingPrograms = [
    {
        id: 1,
        name: "Fullstack Java",
        routes: [
            {
                title: "Backend sólido",
                topics: [
                    "Spring Boot",
                    "APIs REST",
                    "Bases de datos SQL",
                    "Testing",
                    "Git",
                ],
            },
            {
                title: "Cloud Ready",
                topics: [
                    "Docker",
                    "AWS",
                    "Microservicios",
                ],
            },
            {
                title: "Inglés técnico",
                topics: [
                    "Inglés técnico",
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Desarrollador de Unity",
        routes: [
            {
                title: "Fundamentos de desarrollo",
                topics: [
                    "Programación en C#",
                    "Desarrollo de videojuegos en Unity",
                ],
            },
            {
                title: "Diseño y jugabilidad",
                topics: [
                    "Diseño de mecánicas de juego",
                    "Física y animaciones",
                ],
            },
            {
                title: "Producción y publicación",
                topics: [
                    "Control de versiones con Git",
                    "Optimización de rendimiento",
                    "Publicación de proyectos",
                ],
            },
        ],
    },
    {
        id: 3,
        name: "IT Support",
        routes: [
            {
                title: "Fundamentos de IT",
                topics: [
                    "Sistemas operativos (Windows y Linux)",
                    "Redes y conectividad",
                ],
            },
            {
                title: "Soporte técnico",
                topics: [
                    "Soporte técnico a usuarios",
                    "Gestión de incidencias",
                    "Herramientas de ticketing",
                ],
            },
            {
                title: "Cloud y seguridad",
                topics: [
                    "Ciberseguridad básica",
                    "Servicios en la nube",
                    "Inglés técnico",
                ],
            },
        ],
    },
    {
        id: 4,
        name: "Power BI",
        routes: [
            {

                title: "Análisis de datos",
                topics: [
                    "Estadística aplicada",
                    "Visualización de datos",
                ],
            },
            {
                title: "Herramientas",
                topics: [
                    "Power BI",
                    "Python",
                ],
            },
        ],
    },
];


const getProgramNames = (trainingPrograms) => programNames = trainingPrograms.map(program => program.name);

// const getProgram = (trainingPrograms) => trainingPrograms.map(({ id, name }) => ({ id, name }));
const getRouteByID = (trainingPrograms) => {
    
    const array = trainingPrograms.map((el) => {
        console.log(el.routes);
        return el.routes
    })
    // console.log(array);
    
};



const tabsRender = (programNames) => {

    if (trainingPrograms === undefined || trainingPrograms.length === 0) return
    programNames.forEach(name => {
        const programListElement = document.createElement("li")
        programListElement.innerHTML = `${name}`
        programTabList.appendChild(programListElement);
    })
}

const getFirstThreeTopics = ( topics ) => {
    return topics.slice(0, 3).join(" &rarr; ")
};

const routesRender = (trainingPrograms) => {

    if (trainingPrograms === undefined || trainingPrograms.length === 0) return

    trainingPrograms.forEach((program) => {
        program.routes
        

        const card = document.createElement("div");
        card.innerHTML = `
            <div class="content__topics__cards__card">
                <h4>${program.name}</h4>
                <span>${getFirstThreeTopics(program.routes.map((el, i)=> el.topics[i]))}</span>
                <p>Temas: <span> ${program.routes.length}</span></p>
            </div>
        `
        contentRoutesCards.appendChild(card)
    })

}

tabsRender(getProgramNames(trainingPrograms));

routesRender(trainingPrograms)

getRouteByID(trainingPrograms)