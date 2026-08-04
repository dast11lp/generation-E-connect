import { createProgramForm } from "../../components/forms/program-form/program-form.js";
import { createManageProgramForm } from "../../components/forms/manage-program-form/manage-program-form.js";
import { escapeHtml } from "../../components/utils/html.js";
import { normalizeTopic } from "../../components/utils/topics.js";

const programTabList = document.querySelector('#program-tab-list');
const contentRoutesCards = document.querySelector('.content__routes__route')
const contentTopicsCards = document.querySelector('.content__topics__cards')
const topicsTitle = document.querySelector('#topics-title')
const openFormBtn = document.querySelector('#open-program-form')
const openManageProgramBtn = document.querySelector('#open-manage-program-form');
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
    return topics
        .slice(0, 3)
        .map((topic) => normalizeTopic(topic).title)
        .join(" &rarr; ")
};

const renderTopics = (route) => {
    if (!route) return

    topicsTitle.textContent = `Habilidades clave --- ${route.title}`
    contentTopicsCards.innerHTML = route.topics.map(createTopicAccordion).join("");
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

function createLinkItem(url) {
  return `
    <li>
      <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="topic-acordeon__link">
        🔗 ${escapeHtml(url)}
      </a>
    </li>
  `;
}

function createTopicAccordion(topicRaw) {
  const topic = normalizeTopic(topicRaw);
  const hasLinks = topic.links && topic.links.length > 0;

  return `
    <div class="content__topics__cards__card">
      <button type="button" class="topic-acordeon__header" aria-expanded="false" ${hasLinks ? "" : "disabled"}>
        <span class="topic-acordeon__flecha">▶</span>
        <h4>${escapeHtml(topic.title)}</h4>
      </button>

      ${hasLinks ? `
        <div class="topic-acordeon__contenido">
          <ul class="topic-acordeon__links">
            ${topic.links.map(createLinkItem).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
}

contentTopicsCards.addEventListener("click", (event) => {
  const header = event.target.closest(".topic-acordeon__header");
  if (!header || header.disabled) return;

  const card = header.closest(".content__topics__cards__card");
  const isOpen = card.classList.toggle("content__topics__cards__card--abierto");
  header.setAttribute("aria-expanded", String(isOpen));
});

// ============ Apertura del modal con el formulario específico de programas ============

openFormBtn.addEventListener('click', async () => {
    await customElements.whenDefined('base-modal');

    const programForm = await createProgramForm();

    programForm.element.addEventListener('program-created', (event) => {
        const newProgram = addProgram(event.detail);
        refreshAll(newProgram.id);
        programFormModal.close();
    });

    programForm.element.addEventListener('program-form-cancel', () => {
        programFormModal.close();
    });

    programFormModal.open({
        title: "Nuevo programa de formación",
        content: programForm.element,
        footer: programForm.footerElement,
    });
});

openManageProgramBtn.addEventListener('click', async () => {
    await customElements.whenDefined('base-modal');

    const manageForm = await createManageProgramForm();

    manageForm.element.addEventListener('program-form-updated', () => {
        refreshAll();
        programFormModal.close();
    });

    manageForm.element.addEventListener('program-form-deleted', () => {
        refreshAll();
        programFormModal.close();
    });

    manageForm.element.addEventListener('manage-program-cancel', () => {
        programFormModal.close();
    });

    programFormModal.open({
        title: "Administrar programas",
        content: manageForm.element,
        footer: manageForm.footerElement,
    });
});

refreshAll();