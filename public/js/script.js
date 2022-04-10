const form = document.getElementById('create');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
    validateInputs();
})

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

    if(usernameValue === '') {
        showError(username, 'Please choose a username')
    } else {
        showSuccess(username);
    }

    if(emailValue === '') {
        showError(email, 'Please fill in your email');
    } else if (!isValidEmail(emailValue)) {
        showError(email, 'Choose a valid email adress');
    } else {
        showSuccess(email);
    }

    if(passwordValue === '') {
        showError(password, 'Please choose a password');
    } else {
        showSuccess(password);
    }
 }

 console.log("script connected")