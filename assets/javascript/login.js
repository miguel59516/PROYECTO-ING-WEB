// Eventos "blur" para validar en tiempo real
document.getElementById("email-login").addEventListener("blur", validateEmail);
document.getElementById("password-login").addEventListener("blur", validatePassword);

// Evento al enviar el formulario
document.getElementById("login-btn").addEventListener("click", function(e) {
  const valid = validateEmail() && validatePassword();
  if (!valid) {
    e.preventDefault(); // Evitar envío si hay errores
  } else {
    loginUser();
  }
});

// Mostrar errores
function showError(field, message) {
  const input = document.getElementById(field);
  const errorSpan = document.getElementById("error-" + field);
  input.classList.add("error");
  errorSpan.textContent = message;
  errorSpan.style.display = "block";
}

// Limpiar errores
function clearError(field) {
  const input = document.getElementById(field);
  const errorSpan = document.getElementById("error-" + field);
  input.classList.remove("error");
  errorSpan.textContent = "";
  errorSpan.style.display = "none";
}

// Validar email
function validateEmail() {
  const email = document.getElementById("email-login").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    showError("email-login", "El email es obligatorio.");
    return false;
  } else if (!emailPattern.test(email)) {
    showError("email-login", "Formato de correo inválido.");
    return false;
  } else {
    clearError("email-login");
    return true;
  }
}

// Validar contraseña
function validatePassword() {
  const password = document.getElementById("password-login").value.trim();
  
  if (password === "") {
    showError("password-login", "La contraseña es obligatoria.");
    return false;
  } else if (password.length < 6) {
    showError("password-login", "Debe tener al menos 6 caracteres.");
    return false;
  } else {
    clearError("password-login");
    return true;
  }
}

// Mostrar/Ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById("password-login");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

// Login con Firebase
function loginUser() {
  const email = document.getElementById("email-login").value.trim();
  const password = document.getElementById("password-login").value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = 'dashboard.html')
    .catch(error => {
      let message = "Error al iniciar sesión.";
      if (error.code === "auth/user-not-found") {
        message = "Usuario no encontrado.";
      } else if (error.code === "auth/wrong-password") {
        message = "Contraseña incorrecta.";
      } else if (error.code === "auth/invalid-email") {
        message = "Formato de correo inválido.";
      }
      showError("email-login", message);
    });
}
