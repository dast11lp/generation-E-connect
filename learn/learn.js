const programTabList = document.querySelector('#program-tab-list');
const contentRoutesCards = document.querySelector('.content__routes__route')
const contentTopicsCards = document.querySelector('.content__topics__cards')
const topicsTitle = document.querySelector('#topics-title')
const openFormBtn = document.querySelector('#open-program-form')
const programFormModal = document.querySelector('#program-form-modal')


initStorage();
let trainingPrograms = getPrograms();

const getProgramNames = (trainingPrograms) => trainingPrograms.map(program => program.name);

const getProgramByID = (programs, id) => {
    const program = programs.find(p => p.id === id);
    return program
}

const tabsRender = (programNames) => {
    programTabList.innerHTML = "";

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
    return topics.slice(0, 3).join(" &rarr; ")
};

const renderTopics = (route) => {
    if (!route) return

    topicsTitle.textContent = `Habilidades clave --- ${route.title}`
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
    if (!program) return

    contentRoutesCards.innerHTML = "";

    if (!program.routes || program.routes.length === 0) {
        renderTopics(null)
        contentTopicsCards.innerHTML = "<p>Este programa todavía no tiene rutas.</p>"
        return
    }

    program.routes.forEach((route, index) => {
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


function refreshAll(selectedProgramId = null) {
    trainingPrograms = getPrograms();

    tabsRender(getProgramNames(trainingPrograms));

    const targetId = selectedProgramId ?? trainingPrograms[0]?.id;
    const program = getProgramByID(trainingPrograms, targetId);
    renderRoutes(program);

    if (selectedProgramId !== null) {
        const index = trainingPrograms.findIndex(p => p.id === selectedProgramId);
        const tabs = document.querySelectorAll('#program-tab-list li');
        tabs.forEach(li => li.classList.remove('active'));
        if (tabs[index]) tabs[index].classList.add('active');
    }
}



openFormBtn.addEventListener('click', async () => {
    await customElements.whenDefined('program-form-modal');
    programFormModal.open();
});

programFormModal.addEventListener('program-created', (event) => {
    const newProgram = addProgram(event.detail); 
    refreshAll(newProgram.id);
});

refreshAll();
