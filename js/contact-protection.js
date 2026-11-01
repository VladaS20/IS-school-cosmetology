document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");

  if (!form) return;

  const phone = form.querySelector("#contact-phone");
  const message = form.querySelector("#contact-message");
  const honeypot = form.querySelector("#contact-website");
  const submitButton = form.querySelector('[type="submit"]');

  if (!phone || !message || !honeypot) {
    console.error("Contact form: не найдены необходимые поля.");
    return;
  }

  /*
   * 1. Маска российского номера телефона
   * Формат: +7 (999) 123-45-67
   */

  function formatRussianPhone(value) {
    let digits = value.replace(/\D/g, "");

    // Поддерживаем ввод номера с 8 или 7 в начале
    if (digits.startsWith("7") || digits.startsWith("8")) {
      digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    if (!digits.length) return "";

    let result = "+7";

    if (digits.length > 0) {
      result += " (" + digits.slice(0, 3);
    }

    if (digits.length >= 3) {
      result += ")";
    }

    if (digits.length > 3) {
      result += " " + digits.slice(3, 6);
    }

    if (digits.length > 6) {
      result += "-" + digits.slice(6, 8);
    }

    if (digits.length > 8) {
      result += "-" + digits.slice(8, 10);
    }

    return result;
  }

  phone.addEventListener("input", () => {
    phone.value = formatRussianPhone(phone.value);
    phone.setCustomValidity("");
  });

  phone.addEventListener("blur", () => {
    const digits = phone.value.replace(/\D/g, "");

    if (digits.length !== 11 || !digits.startsWith("7")) {
      phone.setCustomValidity(
        "Введите российский номер телефона полностью: +7 (999) 123-45-67.",
      );
    } else {
      phone.setCustomValidity("");
    }
  });

  phone.addEventListener("focus", () => {
    phone.setCustomValidity("");
  });

  /*
   * 2. Проверка сообщения на ссылки
   */

  function containsLink(text) {
    const urlPattern =
      /(?:https?:\/\/|ftp:\/\/|www\.)\S+|(?:^|[\s(<])(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|net|org|info|biz|ru|рф|su|io|co|me|site|online|xyz|top|shop|pro|store|tech|app|dev|ai|москва|рф)(?::\d+)?(?:[/?#][^\s]*)?/iu;

    return urlPattern.test(text);
  }

  /*
   * 3. Проверка языка сообщения
   *
   * Требуем хотя бы одну русскую букву.
   * Английские названия препаратов допустимы,
   * если в сообщении есть русский текст.
   */

  function hasRussianText(text) {
    return /[а-яё]/i.test(text);
  }

  /*
   * 4. Уведомление об ошибке
   */

  function showError(field, text) {
    field.setCustomValidity(text);
    field.reportValidity();
    field.focus();
  }

  /*
   * 5. Защита при отправке
   */

  form.addEventListener("submit", (event) => {
    // Honeypot заполнен — считаем отправку подозрительной
    if (honeypot.value.trim() !== "") {
      event.preventDefault();
      return;
    }

    const phoneDigits = phone.value.replace(/\D/g, "");
    const messageText = message.value.trim();

    phone.setCustomValidity("");

    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      event.preventDefault();

      showError(phone, "Введите полный российский номер: +7 (999) 123-45-67.");

      return;
    }

    if (!messageText) {
      event.preventDefault();

      showError(message, "Пожалуйста, напишите ваш вопрос.");

      return;
    }

    if (containsLink(messageText)) {
      event.preventDefault();

      showError(
        message,
        "Пожалуйста, удалите ссылки из сообщения. Если нужно, укажите название сайта обычным текстом.",
      );

      return;
    }

    if (!hasRussianText(messageText)) {
      event.preventDefault();

      showError(
        message,
        "Напишите вопрос на русском языке. Названия препаратов и профессиональные термины на английском допустимы.",
      );

      return;
    }

    message.setCustomValidity("");

    // Не отключаем кнопку здесь:
    // форму отправляет contact-handler.php.
  });

  message.addEventListener("input", () => {
    message.setCustomValidity("");
  });
});
