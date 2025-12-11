/**
 * Módulo de Formulario de Contacto
 * Gestiona: validación en tiempo real, envío de datos con EmailJS, mensajes de estado
 * 
 * @module ContactForm
 * @exports {Object} ContactForm
 */

const ContactForm = (() => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    /**
     * Validadores para cada campo del formulario
     */
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'El nombre es obligatorio';
            if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'El correo electrónico es obligatorio';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'El correo electrónico no es válido';
            return '';
        },
        subject: (value) => {
            if (!value.trim()) return 'El asunto es obligatorio';
            if (value.trim().length < 3) return 'El asunto debe tener al menos 3 caracteres';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'El mensaje es obligatorio';
            if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
            return '';
        }
    };

    const validateField = (field) => {
        const fieldName = field.name;
        const fieldValue = field.value;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        const errorMessage = validators[fieldName]?.(fieldValue) || '';
        
        if (errorMessage) {
            field.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
            return false;
        } else {
            field.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
            return true;
        }
    };

    const validateForm = () => {
        if (!form) return false;
        const fields = form.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        return isValid;
    };

    const showMessage = (message, isSuccess = true) => {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        formMessage.classList.add(isSuccess ? 'form-message--success' : 'form-message--error');
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    };

    /**
     * Envía el formulario usando EmailJS
     */
    const submitToEmailJS = async (form) => {
        try {
            await emailjs.sendForm('service_703yk7s', 'template_3q1x525', form);

            showMessage('✅ ¡Mensaje enviado con éxito! Te contactaré pronto.', true);
            form.reset();

            const fields = form.querySelectorAll('.form-input, .form-textarea');
            fields.forEach(field => field.classList.remove('error'));
        } catch (error) {
            console.error('Error al enviar con EmailJS:', error);
            showMessage('❌ Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', false);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Por favor, corrige los errores en el formulario', false);
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        try {
            await submitToEmailJS(form);
        } catch (error) {
            showMessage('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', false);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    };

    const init = () => {
        if (!form) return;
        
        const fields = form.querySelectorAll('.form-input, .form-textarea');
        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
        
        form.addEventListener('submit', handleSubmit);
    };

    return { init };
})();
