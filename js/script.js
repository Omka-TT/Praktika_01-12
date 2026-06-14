/* =========================================================
   FINKA BANK — SCRIPT
   Mobile menu, loan calculator, news "show more",
   testimonials slider, contact form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. MOBILE MENU (burger toggle)
     --------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
      burger.classList.toggle('burger--open');
    });

    // Close menu after clicking a link (mobile)
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        burger.classList.remove('burger--open');
      });
    });
  }

  /* ---------------------------------------------------------
     2. LOAN CALCULATOR (annuity formula)
     Monthly payment = P * (r * (1+r)^n) / ((1+r)^n - 1)
     where P = amount, r = monthly rate, n = term in months
     --------------------------------------------------------- */
  const amountInput = document.getElementById('amount');
  const termInput = document.getElementById('term');
  const rateInput = document.getElementById('rate');

  const amountValue = document.getElementById('amountValue');
  const termValue = document.getElementById('termValue');
  const rateValue = document.getElementById('rateValue');
  const paymentValue = document.getElementById('paymentValue');
  const totalValue = document.getElementById('totalValue');

  function formatMoney(num) {
    return Math.round(num).toLocaleString('ru-RU') + ' сом';
  }

  function calculate() {
    const amount = parseFloat(amountInput.value);
    const termMonths = parseInt(termInput.value, 10);
    const annualRate = parseFloat(rateInput.value);

    // Convert the annual percentage rate to a monthly decimal rate
    const monthlyRate = annualRate / 100 / 12;

    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = amount / termMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = amount * (monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = monthlyPayment * termMonths;

    amountValue.textContent = formatMoney(amount);
    termValue.textContent = termMonths + ' мес.';
    rateValue.textContent = annualRate.toFixed(1).replace('.', ',') + '%';
    paymentValue.textContent = formatMoney(monthlyPayment);
    totalValue.textContent = 'Всего к выплате: ' + formatMoney(totalPayment);
  }

  if (amountInput && termInput && rateInput) {
    [amountInput, termInput, rateInput].forEach((input) => {
      input.addEventListener('input', calculate);
    });
    calculate(); // initial render
  }

  /* ---------------------------------------------------------
     3. NEWS — "Показать ещё" button
     --------------------------------------------------------- */
  const showMoreBtn = document.getElementById('showMoreBtn');

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const hiddenCards = document.querySelectorAll('.news-card--hidden');

      hiddenCards.forEach((card) => {
        card.classList.remove('news-card--hidden');
      });

      // Hide the button once everything is visible
      showMoreBtn.style.display = 'none';
    });
  }

  /* ---------------------------------------------------------
     4. TESTIMONIALS SLIDER (no libraries)
     --------------------------------------------------------- */
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderDots = document.getElementById('sliderDots');

  if (sliderTrack && sliderPrev && sliderNext && sliderDots) {
    const slides = sliderTrack.querySelectorAll('.slide');
    let currentSlide = 0;

    // Build the dots dynamically based on the number of slides
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider__dot');
      dot.setAttribute('aria-label', 'Перейти к отзыву ' + (index + 1));
      if (index === 0) dot.classList.add('slider__dot--active');
      dot.addEventListener('click', () => goToSlide(index));
      sliderDots.appendChild(dot);
    });

    const dots = sliderDots.querySelectorAll('.slider__dot');

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('slider__dot--active', i === currentSlide);
      });
    }

    sliderPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    sliderNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  /* ---------------------------------------------------------
     5. CONTACT FORM VALIDATION (contacts.html)
     --------------------------------------------------------- */
  const feedbackForm = document.getElementById('feedbackForm');

  if (feedbackForm) {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    function setError(input, errorEl, message) {
      input.closest('.form__field').classList.add('has-error');
      errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.closest('.form__field').classList.remove('has-error');
      errorEl.textContent = '';
    }

    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formSuccess.classList.remove('form__success--visible');

      let isValid = true;

      // Name: required, at least 2 characters
      if (nameInput.value.trim().length < 2) {
        setError(nameInput, nameError, 'Введите имя (минимум 2 символа)');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Phone: required, simple pattern check
      const phonePattern = /^[+\d][\d\s\-()]{6,}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        setError(phoneInput, phoneError, 'Введите номер телефона, например +996 700 000 000');
        isValid = false;
      } else {
        clearError(phoneInput, phoneError);
      }

      // Message: required, at least 5 characters
      if (messageInput.value.trim().length < 5) {
        setError(messageInput, messageError, 'Опишите вопрос (минимум 5 символов)');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (isValid) {
        formSuccess.classList.add('form__success--visible');
        feedbackForm.reset();
      }
    });

    // Clear error as soon as the user starts fixing a field
    [nameInput, phoneInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        const errorEl = input.nextElementSibling;
        if (errorEl && errorEl.classList.contains('form__error')) {
          clearError(input, errorEl);
        }
      });
    });
  }

});
