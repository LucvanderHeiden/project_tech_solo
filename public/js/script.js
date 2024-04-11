const form = document.getElementById('create');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
    e.preventDefault(); // Prevents default behavior (which would automatically submit the form)
    
    // Check if all inputs are valid
    username.dispatchEvent(new Event('input'));
    email.dispatchEvent(new Event('input'));
    password.dispatchEvent(new Event('input'));

    if (!form.checkValidity()) {
        form.reportValidity(); // Report when fields are not valid
    } else {
        form.submit(); // Submit the form only if all forms are valid
    }
});

// Username
username.addEventListener("input", (event) => {
  if (username.validity.valueMissing) { //Check if 'valueMissing', which checks if the input is empty
    username.setCustomValidity('Please choose a username'); // if it is empty display custom error message
    showError(username);                                    // and add error class to change the look of the input
  } else if (username.validity.tooShort || username.validity.tooLong) {
    username.setCustomValidity('Username must be between 3 and 25 characters long');
    showError(username);
  } else {
    username.setCustomValidity("");
    showSuccess(username);
  }
});

// Email adress
email.addEventListener("input", (event) => {
  if (email.validity.valueMissing) {
    email.setCustomValidity('Please fill in your email adress');
    showError(email);
  } else if (email.validity.typeMismatch) {
    email.setCustomValidity('Please enter a valid email address');
    showError(email);
  } else {
    email.setCustomValidity("");
    showSuccess(email);
  }
});

// Password
password.addEventListener("input", (event) => {
  if (password.validity.valueMissing) {
    password.setCustomValidity('Please choose a password');
    showError(password);
  } else if (password.validity.tooShort || password.validity.tooLong) {
    password.setCustomValidity('Password must be between 8 and 30 characters long');
    showError(password);
  } else {
    password.setCustomValidity("");
    showSuccess(password);
  }
});

// Add & remove classes to show red or green input field
const showError = element => {
    const inputControl = element.parentElement;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const showSuccess = element => {
    const inputControl = element.parentElement;
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const scrollToError = () => {
    window.scroll({             /* Scrolls the window up to the top automatically so they user can easily see what's wrong in the form */
    top: 0,
    left: 0,
    behavior: 'smooth'
    });
}

const gameLabels = document.querySelectorAll('.game-label');

gameLabels.forEach(label => {
  label.addEventListener('click', () => {
    const checkbox = label.previousElementSibling;
    checkbox.checked = !checkbox.checked;
    label.classList.toggle('checked');
  });
});

const platformLabels = document.querySelectorAll('.platform-label');

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
});

 console.log("script connected")