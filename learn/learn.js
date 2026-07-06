const programTabList = document.querySelector('#program-tab-list');
const contentRoutesCards = document.querySelector('.content__routes__route')
const contentTopicsCards = document.querySelector('.content__topics__cards')

const trainingPrograms = [
    {
        id: 1,
        name: "Fullstack Java",
        routes: [
            {
                id: 1,
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
                id: 2,
                title: "Cloud Ready",
                topics: [
                    "Docker",
                    "AWS",
                    "Microservicios",
                ],
            },
            {
                id: 3,
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
                id: 1,
                title: "Fundamentos de desarrollo",
                topics: [
                    "Programación en C#",
                    "Desarrollo de videojuegos en Unity",
                ],
            },
            {
                id: 2,
                title: "Diseño y jugabilidad",
                topics: [
                    "Diseño de mecánicas de juego",
                    "Física y animaciones",
                ],
            },
            {
                id: 3,
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
                id: 1,
                title: "Fundamentos de IT",
                topics: [
                    "Sistemas operativos (Windows y Linux)",
                    "Redes y conectividad",
                ],
            },
            {
                id: 1,
                title: "Soporte técnico",
                topics: [
                    "Soporte técnico a usuarios",
                    "Gestión de incidencias",
                    "Herramientas de ticketing",
                ],
            },
            {
                id: 1,
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
                id: 1,
                title: "Análisis de datos",
                topics: [
                    "Estadística aplicada",
                    "Visualización de datos",
                ],
            },
            {
                id: 2,
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

const getProgramByID = (programs, id = 1) => {
    const program = programs.find(p => p.id === id);
    return program
}



const tabsRender = (programNames) => {

    if (trainingPrograms === undefined || trainingPrograms.length === 0) return
    programNames.forEach((name, index) => {
        const programListElement = document.createElement("li")
        programListElement.innerHTML = `${name}`

        if (index === 0) programListElement.classList.add("active")

        programListElement.addEventListener("click", () => {
            document.querySelectorAll('#program-tab-list li').forEach(li => li.classList.remove("active"))
            programListElement.classList.add("active")

            const programId = trainingPrograms[index].id;
            const programByID = getProgramByID(trainingPrograms, programId);
            renderRoutes(programByID);
        })
        programTabList.appendChild(programListElement);
    })
}

const getFirstThreeTopics = (topics) => {

    // routes.forEach((route) => {
    //     console.log(route.topics);
    // })
    // topics.slice(0, 3).join(" &rarr; ")
    return topics.slice(0, 3).join(" &rarr; ")
};

const renderTopics = (route) => {
    if (!route) return

    contentTopicsCards.innerHTML = "";

    route.topics.forEach((topic) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="content__topics__cards__card">
                <h4>${topic}</h4>
            </div>
        `
        contentTopicsCards.appendChild(card)
    })
}

const renderRoutes = (program) => {

    program.routes.topics
    if (!program) return

    contentRoutesCards.innerHTML = "";

    program.routes.forEach((route, index) => {
        console.log(route.topics);
        
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="content__topics__cards__card ${index === 0 ? 'active' : ''}">
                <h4>${route.title}</h4>
                <span>${getFirstThreeTopics(route.topics)}</span>
                <p>Temas: <span> ${route.topics.length}</span></p>
            </div>
        `
        card.addEventListener("click", () => {
            contentRoutesCards.querySelectorAll('.content__topics__cards__card').forEach(c => c.classList.remove("active"))
            card.querySelector('.content__topics__cards__card').classList.add("active")
            renderTopics(route)
        })
        contentRoutesCards.appendChild(card)
    })

    renderTopics(program.routes[0])
}

tabsRender(getProgramNames(trainingPrograms));

let programByID = getProgramByID(trainingPrograms)
renderRoutes(programByID)