document.querySelectorAll(".navbar").forEach((navbar) => {
    const toggle = navbar.querySelector(".nav-toggle");
    const links = navbar.querySelector(".nav-links");

    if (!toggle || !links) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navbar.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
});

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

function updateInternshipCodeLabel(picker, value) {
    const summary = picker.querySelector("summary");

    if (!summary) {
        return;
    }

    summary.textContent = value || "Internship Code";
}

function resetCustomFields(form) {
    const picker = form.querySelector(".career-code-picker");

    if (picker) {
        picker.open = false;
        updateInternshipCodeLabel(picker, "");
    }
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
        resetCustomFields(form);
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

document.querySelectorAll(".career-code-picker").forEach((picker) => {
    picker.querySelectorAll("input[type='radio']").forEach((option) => {
        option.addEventListener("change", () => {
            updateInternshipCodeLabel(picker, option.value);
            picker.open = false;
        });
    });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const images = Array.from(carousel.querySelectorAll(".career-carousel-frame img"));
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let activeIndex = images.findIndex((image) => image.classList.contains("is-active"));

    if (!images.length || !previousButton || !nextButton) {
        return;
    }

    if (activeIndex < 0) {
        activeIndex = 0;
        images[activeIndex].classList.add("is-active");
    }

    function showImage(nextIndex) {
        images[activeIndex].classList.remove("is-active");
        activeIndex = (nextIndex + images.length) % images.length;
        images[activeIndex].classList.add("is-active");
    }

    previousButton.addEventListener("click", () => showImage(activeIndex - 1));
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
});

let activeProductModal = null;

function closeProductModal() {
    if (!activeProductModal) {
        return;
    }

    activeProductModal.classList.remove("is-open");
    activeProductModal.setAttribute("aria-hidden", "true");
    activeProductModal = null;
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", () => {
        const modal = document.getElementById(button.dataset.modalOpen);

        if (!modal) {
            return;
        }

        activeProductModal = modal;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        const closeButton = modal.querySelector("[data-modal-close]");
        if (closeButton) {
            closeButton.focus();
        }
    });
});

document.querySelectorAll(".product-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest("[data-modal-close]")) {
            closeProductModal();
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeProductModal();
    }
});
