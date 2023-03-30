const product = document.getElementById("product");
const price = document.getElementById("price");
const submit = document.getElementById("submit");
product.innerHTML = localStorage.getItem("totalProducts");
price.innerHTML = localStorage.getItem("totalPrice");
const currentUser = localStorage.getItem("currentUser");
const currentName = localStorage.getItem("currentName");

submit.addEventListener("click", () => {
  fetch("/approve", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      clientEmail: currentUser,
      currentName: currentName,
    }),
  }).catch((error) => console.error(error));
  window.location.href = "/";
});
