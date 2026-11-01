document.addEventListener("DOMContentLoaded", function () {
  const faqSections = document.querySelectorAll(".s-faq");

  if (!faqSections.length) {
    console.warn("FAQ: секция .s-faq не найдена");
    return;
  }

  faqSections.forEach(function (section) {
    const items = section.querySelectorAll(".faq__item");

    items.forEach(function (item) {
      const button = item.querySelector(".faq__question");
      const answer = item.querySelector(".faq__answer");

      if (!button || !answer) return;

      button.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");

        // Закрываем все вопросы в этой секции
        items.forEach(function (otherItem) {
          const otherButton = otherItem.querySelector(".faq__question");
          const otherAnswer = otherItem.querySelector(".faq__answer");

          otherItem.classList.remove("is-open");
          otherButton.setAttribute("aria-expanded", "false");
          otherAnswer.setAttribute("aria-hidden", "true");
        });

        // Если вопрос был закрыт, открываем его
        if (!isOpen) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          answer.setAttribute("aria-hidden", "false");
        }
      });
    });
  });
});
