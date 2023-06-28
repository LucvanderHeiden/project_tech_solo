const form = document.getElementById('create');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
    e.preventDefault(); // Form wordt niet automatisch gesubmit totdat inputs valid zijn

    if (validateInputs()) {
        // Checkt of de inputs valid zijn voordat de form wordt gesubmit 
        form.submit();
    }
});

const scrollToError = () => {
    window.scroll({             /* Scroll automatisch naar boven na submit zodat de gebruiker eventuele error messages kan zien */
    top: 0,
    left: 0,
    behavior: 'smooth'
    });
}

const showError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
    scrollToError();
}

const showSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerHTML = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const isValidEmail = email => {
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return pattern.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();            /* Trim zorgt ervoor dat alle whitespace van een string wordt weggehaald*/
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (usernameValue === '') {
        showError(username, 'Please choose a username');
        return false; // Houdt form submission tegen
    } else {
        showSuccess(username);
    }

    if (emailValue === '') {
        showError(email, 'Please fill in your email');
        return false; // Houdt form submission tegen
    } else if (!isValidEmail(emailValue)) {
        showError(email, 'Choose a valid email address');
        return false; // Houdt form submission tegen
    } else {
        showSuccess(email);
    }

    if (passwordValue === '') {
        showError(password, 'Please choose a password');
        return false; // Houdt form submission tegen
    } else {
        showSuccess(password);
    }

    return true; // Laat form submission toe
};

const gameLabels = document.querySelectorAll('.game-label');

gameLabels.forEach(label => {
  label.addEventListener('click', () => {
    const checkbox = label.previousElementSibling;
    checkbox.checked = !checkbox.checked;
    label.classList.toggle('checked');
  });
});

const platformLabels = document.querySelectorAll('.platforms label');

platformLabels.forEach(label => {
  const checkbox = label.querySelector('input[type="checkbox"]');
  const image = label.querySelector('img');

  label.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    label.classList.toggle('checked');

    if (checkbox.checked) {
      image.classList.add('checked');
    } else {
      image.classList.remove('checked');
    }
  });

  // Voegt een eventlistener toe voor touch apparaten
  label.addEventListener('touchstart', () => {
    checkbox.checked = !checkbox.checked;
    label.classList.toggle('checked');

    if (checkbox.checked) {
      image.classList.add('checked');
    } else {
      image.classList.remove('checked');
    }
  });
});



 console.log("script connected")