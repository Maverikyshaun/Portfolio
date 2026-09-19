async function loadInquiryTypes() {
  const enums = await api("/meta/enums");
  const select = document.querySelector("#inquiryType");
  if (!select) return;
  select.innerHTML = enums.inquiry_type
    .map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
    .join("");
}

async function submitInquiry(event) {
  event.preventDefault();
  const status = document.querySelector("[data-form-status]");
  const form = event.currentTarget;
  const payload = {
    name: form.name.value,
    email: form.email.value,
    company: form.company.value || null,
    inquiry_type: form.inquiry_type.value,
    message: form.message.value,
  };
  status.classList.remove("is-error");
  status.textContent = "Sending…";
  try {
    await api("/inquiries", { method: "POST", body: JSON.stringify(payload) });
    form.reset();
    await loadInquiryTypes();
    status.textContent = "Thanks — I will get back to you shortly.";
  } catch (error) {
    status.classList.add("is-error");
    status.textContent = error.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadInquiryTypes().catch(() => {});
  document.querySelector("[data-contact-form]")?.addEventListener("submit", submitInquiry);
});
