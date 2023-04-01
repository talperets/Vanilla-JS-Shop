const productsContainer = document.getElementById("products-container");
fetch("/active")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Network response was not ok.");
    }
  })
  .then((data) => {
    productsContainer.innerHTML = "";
    data.forEach((order) => {
      const card = document.createElement("div");
      card.classList.add("card");
      const textCard = document.createElement("div");
      textCard.classList.add("textCard");
      const title = document.createElement("h2");
      title.innerText = order.clientEmail;
      textCard.appendChild(title);
      card.appendChild(textCard);
      productsContainer.appendChild(card);
      const productsList = order.product;
      productsList.forEach((val) => {
        const name = document.createElement("h3");
        name.classList.add("name");
        name.innerText = val.title;
        textCard.appendChild(name);
      });
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
