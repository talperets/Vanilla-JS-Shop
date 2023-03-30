const err = document.getElementById("err");
const email = document.getElementById("email");
const fullname = document.getElementById("fullname");
const password = document.getElementById("password");
const confirmPass = document.getElementById("confirm");
const submit = document.getElementById("submit");
const strongPassword = (password) => {
  if (password.length < 8) {
    err.innerHTML = "Your Password is too short";
    submit.disabled = true;
    return false;
  }

  if (password.length > 20) {
    err.innerHTML = "Your Password is too long";
    submit.disabled = true;
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    err.innerHTML = "Please add least one uppercase letter";
    submit.disabled = true;
    return false;
  }

  if (!/[a-z]/.test(password)) {
    err.innerHTML = "Please add least one lowercase letter";
    submit.disabled = true;
    return false;
  }

  if (!/\d/.test(password)) {
    err.innerHTML = "Please add least one digit";
    submit.disabled = true;
    return false;
  }

  err.innerHTML = "";
  submit.disabled = false;
  return true;
};

const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

email.addEventListener("keyup", () => {
  const result = validateEmail(email.value);
  if (result) {
    err.innerHTML = "";
    submit.disabled = false;
  } else {
    err.innerHTML = "Please enter a valid email";
    submit.disabled = true;
  }
});
password.addEventListener("keyup", () => {
  strongPassword(password.value);
});
confirmPass.addEventListener("keyup", () => {
  if (confirmPass.value != password.value) {
    err.innerHTML = "Passwords are not identical";
    submit.disabled = true;
  } else {
    err.innerHTML = "";
    submit.disabled = false;
  }
});

fullname.addEventListener("keyup", () => {
  const fullnameArr = fullname.value.split(" ");
  if (fullname.value == "" || fullnameArr.length < 2) {
    err.innerHTML = "Please enter your full name";
    submit.disabled = true;
  } else {
    err.innerHTML = "";
    submit.disabled = false;
  }
});
const checkFields = () => {
  const fullnameValue = fullname.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const confirmPassValue = confirmPass.value.trim();

  if (
    fullnameValue === "" ||
    emailValue === "" ||
    passwordValue === "" ||
    confirmPassValue === ""
  ) {
    err.innerHTML = "Some fields are empty";
    submit.disabled = true;
    return false;
  } else {
    submit.disabled = false;
    return true;
  }
};
const signup = () => {
  let check = checkFields();
  if (!check) {
    return false;
  }

  fetch("/register", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        localStorage.setItem("currentUser", email.value);
        localStorage.setItem("currentName", fullname.value);
        window.location.href = "/";
      } else if (res.status === 409) {
        err.innerHTML = "User already exists";
      }
      return res.json();
    })
    .catch((error) => console.error(error));
};
submit.addEventListener("click", signup);
