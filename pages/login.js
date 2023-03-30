const err = document.getElementById("err");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");

const login = () => {
  fetch("/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data) {
        err.innerHTML = "Wrong email or password";
      } else {
        localStorage.setItem("currentUser", data.email);
        localStorage.setItem("currentName", data.fullname);

        window.location.href = "store";
        err.innerHTML = "";
      }
    })
    .catch((error) => console.error(error));
};
submit.addEventListener("click", login);
