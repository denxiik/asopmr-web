// contactForm.js

// --- Configuración Constante ---
const CLOUD_FUNCTION_URL = 'https://us-central1-websites-functionalities.cloudfunctions.net/sendEmail';
const SENDER_EMAIL = 'developers@asopmr.org';
const RECIPIENT_EMAIL = 'asopmr@asopmr.org';
const BASE_SUBJECT = 'AsoPMR Formulario'; // Asunto base


/**
 * Inicializa un formulario de contacto para enviar datos a una Función de Cloud de Google.
 * Captura todos los campos de texto/textarea y maneja la verificación de reCAPTCHA v2 y el consentimiento de privacidad.
 *
 * @param {string} formId El ID del elemento del formulario HTML.
 * @param {string} [lang='es'] El idioma para los mensajes de estado (por ejemplo, 'es' para español, 'en' para inglés).
 * @param {string} [subjectPrefix=''] Prefijo adicional para el asunto del correo (ej: 'Contacto Web', 'Inscripción').
 */
function initContactForm(formId, lang = 'es', subjectPrefix = '') {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Formulario con ID "${formId}" no encontrado.`);
        return;
    }

    // Mensajes específicos del idioma
    const messages = {
        es: {
            sending: 'Enviando...',
            verifyRobot: 'Por favor, verifica que no eres un robot.',
            privacyConsent: 'Debes aceptar la política de privacidad para enviar el formulario.',
            // Mensaje para el alert de éxito
            alertSuccess: '¡Tu mensaje ha sido enviado con éxito! Nos pondremos en contacto contigo pronto.',
            sentSuccess: '¡Mensaje enviado con éxito!', // Mensaje para el statusDiv
            sendError: 'Error al enviar el mensaje:',
            connectionError: 'Hubo un error de conexión. Por favor, inténtalo de nuevo.',
            pleaseTryAgain: 'Por favor, inténtalo de nuevo.'
        },
        en: {
            sending: 'Sending...',
            verifyRobot: 'Please verify that you are not a robot.',
            privacyConsent: 'You must accept the privacy policy to submit the form.',
            // Mensaje para el alert de éxito
            alertSuccess: 'Your message has been sent successfully! We will contact you soon.',
            sentSuccess: 'Message sent successfully!', // Mensaje para el statusDiv
            sendError: 'Error sending message:',
            connectionError: 'A connection error occurred. Please try again.',
            pleaseTryAgain: 'Please try again.'
        }
    };
    const currentMessages = messages[lang] || messages.es; // Por defecto español si el idioma no se encuentra

    // Crear o obtener el div de estado específico para este formulario
    let statusDiv = document.getElementById(`${formId}-status`);
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = `${formId}-status`;
        statusDiv.style.marginTop = '20px';
        statusDiv.style.textAlign = 'center';
        form.parentNode.insertBefore(statusDiv, form.nextSibling); // Insertar después del formulario
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el envío de formulario por defecto

        statusDiv.textContent = currentMessages.sending;
        statusDiv.style.color = 'blue';

        // Obtener la respuesta de reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            statusDiv.textContent = currentMessages.verifyRobot;
            statusDiv.style.color = 'red';
            return;
        }

        // Verificar el consentimiento de privacidad si el checkbox existe
        const privacyCheckbox = form.querySelector('input[name="privacy"][type="checkbox"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            statusDiv.textContent = currentMessages.privacyConsent;
            statusDiv.style.color = 'red';
            return;
        }

        // --- Capturar dinámicamente todos los campos del formulario ---
        const formData = {};
        const htmlParts = [];
        const textParts = [];

        // Iterar sobre todos los elementos del formulario
        for (const element of form.elements) {
            // Solo capturamos campos con 'name' y que sean input (texto/email/tel/num) o textarea
            // Excluir elementos como 'submit' o el checkbox de privacidad directamente de esta recolección genérica
            if (element.name && (
                (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'tel' || element.type === 'number' || element.type === 'url' || element.type === 'date')) || // Añadidos más tipos de input
                element.tagName === 'TEXTAREA' ||
                element.tagName === 'SELECT' // Incluir campos de selección
            )) {
                // Para select, el valor es el texto de la opción seleccionada si no es un placeholder
                const value = element.tagName === 'SELECT' && element.options[element.selectedIndex].value === '' 
                              ? '' // Si la opción seleccionada es vacía (placeholder)
                              : element.value;

                if (value) { // Solo añadir campos con valor
                    formData[element.name] = value;
                    htmlParts.push(`<strong>${element.placeholder || element.name || element.title || element.tagName}:</strong> ${value}`);
                    textParts.push(`${element.placeholder || element.name || element.title || element.tagName}: ${value}`);
                }
            }
        }

        // Incluir el consentimiento de privacidad si el checkbox existía y estaba marcado
        if (privacyCheckbox && privacyCheckbox.checked) {
            htmlParts.push(`<strong>Consentimiento de Privacidad:</strong> Aceptado`);
            textParts.push(`Consentimiento de Privacidad: Aceptado`);
        }

        // Construir el cuerpo del correo
        const emailHtmlContent = htmlParts.map(part => `<p>${part}</p>`).join('');
        const emailTextContent = textParts.join('\n');

        // Construir el asunto
        let finalSubject = BASE_SUBJECT;
        if (subjectPrefix) {
            finalSubject += ` - ${subjectPrefix}`;
        }
        // Usar el campo 'name' o 'email' para el asunto si están presentes
        if (formData.name) {
            finalSubject += ` (${formData.name})`;
        } else if (formData.email) {
            finalSubject += ` (${formData.email})`;
        }


        const payload = {
            fromEmail: SENDER_EMAIL,
            fromName: formData.name || 'Contacto Web', // Usar el nombre si existe, sino un genérico
            toEmail: RECIPIENT_EMAIL,
            subject: finalSubject,
            htmlContent: emailHtmlContent,
            textContent: emailTextContent,
            recaptchaToken: recaptchaResponse
        };

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const resultText = await response.text();

            if (response.ok) {
                statusDiv.textContent = currentMessages.sentSuccess;
                statusDiv.style.color = 'green';
                form.reset(); // Limpiar el formulario
                grecaptcha.reset(); // Reiniciar widget reCAPTCHA
                // --- CAMBIO AQUÍ: Mostrar alert al usuario ---
                //alert(currentMessages.alertSuccess); 
            } else {
                console.error(currentMessages.sendError, resultText);
                statusDiv.textContent = `${currentMessages.sendError} ${resultText || currentMessages.pleaseTryAgain}`;
                statusDiv.style.color = 'red';
                grecaptcha.reset(); // Reiniciar reCAPTCHA en caso de error
            }
        } catch (error) {
            console.error('Error de red o inesperado:', error);
            statusDiv.textContent = currentMessages.connectionError;
            statusDiv.style.color = 'red';
            grecaptcha.reset(); // Reiniciar reCAPTCHA en caso de error
        }
    });
}