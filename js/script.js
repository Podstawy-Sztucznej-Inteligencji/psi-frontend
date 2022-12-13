const PROCESS_IMAGE_URL = "http://localhost:8081/test/";
const GET_MODELS_URL = "http://localhost:8081/test";

let counter = 0;

async function getModels() {
    let response = await fetch(GET_MODELS_URL);
    let data = await response.json();

    let select = document.querySelector("#models");
    data.map(model => {
        let option = document.createElement("option");
        option.text = model.name;
        option.value = model.id;
        select.appendChild(option);
    });
}

function getDate() {
    return new Date().toLocaleString().replace(',','');
}

function getResultContent(result) {
    if (result.error != null) return result.error;
    return result.response;
}

function createAccordionHeader(accordionButton) {
    let accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    accordionHeader.id = "heading" + counter;
    accordionHeader.appendChild(accordionButton);
    return accordionHeader;
}

function createAccordionButton(result) {
    let accordionButton = document.createElement("button");
    accordionButton.className = "accordion-button collapsed";
    accordionButton.type = "button";
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", "#collapse" + counter);
    accordionButton.setAttribute("aria-expanded", "true");
    accordionButton.setAttribute("aria-controls", "collapse" + counter);
    accordionButton.textContent = getDate() + " - " + result.model.name + " #" + counter;
    return accordionButton;
}

function createAccordionBody(result) {
    let accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";
    accordionBody.textContent = getResultContent(result);
    return accordionBody;
}

function createAccordionCollapse(accordionBody) {
    let accordionCollapse = document.createElement("div");
    accordionCollapse.id = "collapse" + counter;
    accordionCollapse.className = "accordion-collapse collapse";
    accordionCollapse.setAttribute("aria-labelledby", "heading" + counter);
    accordionCollapse.setAttribute("data-bs-parent", "#results");
    accordionCollapse.appendChild(accordionBody);
    return accordionCollapse;
}

function createAccordionItem(accordionHeader, accordionCollapse) {
    let accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);
    return accordionItem;
}

function updateResultsHeader() {
    let resultsHeader = document.querySelector("#resultsHeader");
    resultsHeader.textContent = "Results (" + counter + ")";
}

async function processImage() {
    let select = document.querySelector("#models");
    let modelsIds = Array.from(select.selectedOptions).map(option => option.value);

    let formData = new FormData();
    formData.append("animal", formFile.files[0]);

    let response = await fetch(PROCESS_IMAGE_URL, {
        method: "POST",
        body: formData,
        headers: {
            'Models': modelsIds
        }
    });

    let results = document.querySelector("#results");
    let data = await response.json();
    data.map(result => {
        counter++;
        let accordionButton = createAccordionButton(result);
        let accordionHeader = createAccordionHeader(accordionButton);
        let accordionBody = createAccordionBody(result);
        let accordionCollapse = createAccordionCollapse(accordionBody);
        let accordionItem = createAccordionItem(accordionHeader, accordionCollapse);

        results.appendChild(accordionItem);
    });

    updateResultsHeader();
}

getModels();
