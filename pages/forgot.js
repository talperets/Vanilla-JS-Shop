const submit = document.getElementById("submit");
const email = document.getElementById("email");
const err = document.getElementById("err");

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

const login = () => {
  submit.disabled = true;
  fetch("/sendmail", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      email: email.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        throw new Error("Something went wrong");
      }
    })
    .catch((error) => console.error(error));
};

submit.addEventListener("click", login);
