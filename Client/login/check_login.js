function check_login() {
  let navbar = document.getElementById("topnav");
  if (!localStorage.length) {
    navbar.innerHTML =
      `<a href="../login/login.html">Entrar</a>` + navbar.innerHTML;
  } else {
    if (localStorage.getItem("login") == "success") {
      navbar.innerHTML =
        `<button class="logout" id="logout-btn" onclick="logout()">Sair</button>
        <a href="#news">Perfil</a>` + navbar.innerHTML;
    } else {
      navbar.innerHTML =
        `<a href="../login/login.html">Entrar</a>` + navbar.innerHTML;
    }
  }
}
