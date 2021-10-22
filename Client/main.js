let btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  // PUT
  // axios
  //   .put("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: {
  //       id: "4",
  //       name: "Novo Nominho",
  //       rg: "533.522.522-52",
  //       matricula: "5423",
  //       address: "Rua Cinco, Teresina",
  //       password: "05dFfr5",
  //     },
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
  // DELETE
  // axios
  //   .delete("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: "4",
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
  // GET
  // axios
  //   .get("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
  // POST
  // axios
  //   .post("http://localhost:8080/", {
  //     headers: { "Content-type": "application/json" },
  //     withCredentials: false,
  //     data: {
  //       id: "",
  //       name: "Nominho",
  //       rg: "133.222.222-22",
  //       matricula: "3425",
  //       address: "Rua Tres, Teresina",
  //       password: "03dFfr3",
  //     },
  //   })
  //   .then((response) => console.log(response))
  //   .catch((e) => console.log(e));
});

function renderHTML(data) {
  let heroName = document.getElementById("hero-name");
  heroName.innerHTML = data.name;

  let heroImg = document.getElementById("hero-img");
  heroImg.innerHTML = `<img src="${data.image.url}" alt="Hero Image" style="width:100%">`;

  let heroPublisher = document.getElementById("hero-publisher");
  heroPublisher.innerHTML =
    "<strong>" + "Editor(a): " + "</strong>" + data.biography.publisher;

  let heroAppearance = document.getElementById("hero-first-appearance");
  if (data.biography["first-appearance"] != "-")
    heroAppearance.innerHTML =
      "<strong>" +
      "Primeira aparição: " +
      "</strong>" +
      data.biography["first-appearance"];
  else heroAppearance.innerHTML = "";

  let heroOccupation = document.getElementById("hero-occupation");
  if (data.work.occupation != "-")
    heroOccupation.innerHTML =
      "<strong>" + "Ocupação: " + "</strong>" + data.work.occupation;
  else heroOccupation.innerHTML = "";
}
