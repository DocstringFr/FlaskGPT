function cloneAnswerBlock() {
    let output = document.querySelector("#gpt-output");
    let template = document.querySelector('#chat-template');
    let clone = template.cloneNode(true);
    clone.id = "";
    output.appendChild(clone);
    clone.classList.remove("hidden")
    return clone.querySelector(".info");
}

function addToLog(message) {
    let infoBlock = cloneAnswerBlock();
    infoBlock.innerText = message;
    return infoBlock;
}

function getChatHistory() {
    let messages = [];
    let infoBlocks = document.querySelectorAll(".info");
    infoBlocks.forEach((block) => {
        messages.push(block.innerHTML);
    });

    messages.shift();
    return messages;
}

// when document finished loading
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#prompt-form");
    const spinnerIcon = document.querySelector("#spinner-icon");
    const sendIcon = document.querySelector("#send-icon");
    const decoder = new TextDecoder();
    let converter = new showdown.Converter()

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        spinnerIcon.classList.remove("hidden");
        sendIcon.classList.add("hidden");

        let prompt = form.elements.prompt.value;
        addToLog(prompt);

        const response = await fetch("/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({messages: getChatHistory()}),
        });

        const reader = response.body.getReader();
        let chunks = "";

        let gptOutput = addToLog("GPT est en train de réfléchir...");

        while (true) {
            const {done, value} = await reader.read();
            if (done) {break;}
            chunks += decoder.decode(value);
            gptOutput.innerHTML = converter.makeHtml(chunks);
        }

        spinnerIcon.classList.add("hidden");
        sendIcon.classList.remove("hidden");
        hljs.highlightAll();
    });
});