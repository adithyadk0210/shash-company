function getFormValue(form, name) {
    const field = form.elements[name];

    if (!field) {
        return "";
    }

    if (field instanceof RadioNodeList) {
        return field.value.trim();
    }

    return field.value.trim();
}

function setStatus(form, message, type) {
    const status = form.querySelector(".form-status");

    if (!status) {
        return;
    }

    status.textContent = message;
    status.dataset.type = type;
}

async function submitForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const formType = form.dataset.formType;

    if (!form.reportValidity()) {
        return;
    }

    const payload = formType === "career"
        ? {
            firstName: getFormValue(form, "first-name"),
            lastName: getFormValue(form, "last-name"),
            email: getFormValue(form, "email"),
            phone: getFormValue(form, "phone"),
            internshipCode: getFormValue(form, "internship-code"),
            message: getFormValue(form, "message")
        }
        : {
            name: getFormValue(form, "name"),
            email: getFormValue(form, "email"),
            message: getFormValue(form, "message")
        };

    const endpoint = formType === "career" ? "/api/careers" : "/api/contact";

    button.disabled = true;
    setStatus(form, "Submitting...", "info");

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Submission failed. Please try again.");
        }

        form.reset();
        setStatus(form, "Submitted successfully. We will get back to you soon.", "success");
    } catch (error) {
        setStatus(form, error.message, "error");
    } finally {
        button.disabled = false;
    }
}

document.querySelectorAll("[data-form-type]").forEach((form) => {
    form.addEventListener("submit", submitForm);
});
