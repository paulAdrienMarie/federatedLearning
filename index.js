import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
//xenv.allowLocalModels = false;

// Reference the elements that we will need
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');

// Create a new object detection pipeline
status.textContent = 'Loading model...';
const captioner = await pipeline('image-to-text', 'Mozilla/distilvit');
status.textContent = 'Ready';

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    // Set up a callback when the file is loaded
    reader.onload = function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        image.id = "image-id";
        imageContainer.appendChild(image);
        detect(image);
    };
    reader.readAsDataURL(file);
});


// Detect objects in the image
async function detect(img) {
    status.textContent = 'Analysing...';
    const output = await captioner(img.src);
    status.textContent = '';
    const textarea = document.createElement("div");
    textarea.id = "textarea-id";
    textarea.innerHTML = "<p>Generated text: " + output[0].generated_text + "</p>";
    imageContainer.append(textarea);
    displayButtons();
}

function displayButtons() {
    const textarea = document.getElementById("textarea-id");
    let buttons = document.createElement('div');
    buttons.id = "buttons-id";
    textarea.appendChild(buttons);
    let button_validate = document.createElement('button');
    button_validate.className = 'check_button';
    button_validate.id = "button-validate-id";
    button_validate.innerText = "Validate generated text";
    let button_retrain = document.createElement('button');
    button_retrain.className = 'check_button';
    button_retrain.id = "button-retrain-id";
    button_retrain.innerText = "Propose new output";
    buttons.appendChild(button_validate);
    buttons.appendChild(button_retrain);
}