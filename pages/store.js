const select = document.getElementById("sorting");
const productsContainer = document.getElementById("products-container");
const buyNowButton = document.querySelector(".card button");
const search = document.getElementById("search");
let currentUser = localStorage.getItem("currentUser");
let orderId;
let selectedProducts = [];

const fetchAndSort = () => {
  fetch("/products")
    .then((res) => res.json())
    .then((products) => {
      let sortedProducts;
      const selectValue = select.value;
      if (selectValue === "lowToHigh") {
        sortedProducts = products.sort((a, b) => a.price - b.price);
      } else if (selectValue === "highToLow") {
        sortedProducts = products.sort((a, b) => b.price - a.price);
      } else {
        sortedProducts = products.sort(
          (a, b) => a.title.charAt(0) - b.title.charAt(0)
        );
      }
      const searchValue = search.value.toLowerCase();
      if (searchValue !== "") {
        sortedProducts = sortedProducts.filter((product) =>
          product.title.toLowerCase().includes(searchValue)
        );
      }

      productsContainer.innerHTML = "";

      sortedProducts.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const textCard = document.createElement("div");
        textCard.classList.add("textCard");

        const title = document.createElement("h2");
        title.innerText = product.title;
        const desc = document.createElement("p");
        desc.style.textAlign = "center";
        desc.innerText = product.description;

        const price = document.createElement("h3");
        price.classList.add("price");
        price.innerText = `$${product.price}`;

        const button = document.createElement("button");
        button.innerText = selectedProducts.includes(product)
          ? "Remove from cart"
          : "Add to cart";
        button.addEventListener("click", () => {
          if (selectedProducts.includes(product)) {
            selectedProducts = selectedProducts.filter((p) => p !== product);
          } else {
            selectedProducts.push(product);
          }

          button.innerText = selectedProducts.includes(product)
            ? "Remove from cart"
            : "Add to cart";
          toggleBuyNowButton();
        });

        textCard.appendChild(title);
        textCard.appendChild(desc);
        textCard.appendChild(price);
        textCard.appendChild(button);

        card.appendChild(textCard);
        productsContainer.appendChild(card);
      });

      toggleBuyNowButton();
    })
    .catch((error) => console.error(error));
};

const toggleBuyNowButton = () => {
  buyNowButton.disabled = selectedProducts.length === 0;
};

fetchAndSort();
select.addEventListener("change", fetchAndSort);
search.addEventListener("input", fetchAndSort);
buyNowButton.addEventListener("click", () => {
  fetch("/order", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      email: currentUser,
      buyingList: selectedProducts,
    }),
  }).catch((error) => console.error(error));
  const totalPrice = selectedProducts.reduce((accumulator, val) => {
    return Math.round(accumulator + val.price);
  }, 0);
  localStorage.setItem("totalPrice", `$${totalPrice}`);
  localStorage.setItem("totalProducts", selectedProducts.length);
  window.location.href = "buy";
});
