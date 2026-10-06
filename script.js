const MAX_FILE_SIZE_MB = 5;
const $ = (id) => document.getElementById(id);

/* ================= FORMULARIO ================= */

const form = $("supportForm");
const submitBtn = $("submitBtn");
const submitLabel = $("submitLabel");
const errorState = $("errorState");
const photoInput = $("photo");
const fileName = $("fileName");
const preview = $("preview");
const description = $("description");
const charCount = $("charCount");

// Número de reporte: hace único el asunto del correo (Gmail no agrupa hilos)
// y se pasa a la página de gracias.
const ticketNumber = Date.now().toString().slice(-5);
$("ticketNumber").textContent = `#${ticketNumber}`;
$("subjectField").value = `[Support_Endler_Runner] Soporte #${ticketNumber}`;

const thanksUrl = new URL("gracias.html", window.location.href);
thanksUrl.searchParams.set("pedido", ticketNumber);
$("nextField").value = thanksUrl.href;

description.addEventListener("input", () => {
  charCount.textContent = `${description.value.length} / 800`;
});

function showError(msg) { errorState.textContent = msg; errorState.hidden = false; }
function hideError() { errorState.hidden = true; }

function clearPhoto() {
  photoInput.value = "";
  fileName.textContent = "Ningún archivo seleccionado";
  preview.hidden = true;
  preview.removeAttribute("src");
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return clearPhoto();

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    clearPhoto();
    return showError(`La imagen pesa demasiado. El límite es ${MAX_FILE_SIZE_MB} MB.`);
  }
  hideError();
  fileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => { preview.src = e.target.result; preview.hidden = false; };
  reader.readAsDataURL(file);
});

// Envío nativo (sin fetch) para que el archivo viaje como multipart real.
form.addEventListener("submit", (event) => {
  const email = $("email");
  if (!email.value.trim() || !email.checkValidity()) {
    event.preventDefault();
    return showError("Escribe un correo válido para poder responderte.");
  }
  if (!description.value.trim()) {
    event.preventDefault();
    return showError("Cuéntanos qué pasó antes de enviar.");
  }
  const file = photoInput.files[0];
  if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    event.preventDefault();
    return showError(`La imagen pesa demasiado. El límite es ${MAX_FILE_SIZE_MB} MB.`);
  }
  hideError();
  submitBtn.disabled = true;
  submitLabel.textContent = "Enviando...";
});
