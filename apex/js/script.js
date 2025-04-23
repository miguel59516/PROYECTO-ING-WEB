document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('form-container');
    const showRegisterBtn = document.getElementById('show-register');
    const backToLoginBtn = document.getElementById('back-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const passwordToggles = document.querySelectorAll('.toggle-password');
   
    // Mostrar formulario de registro
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.add('show-register');
    });
   
    // Volver al formulario de login
    backToLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.remove('show-register');
    });
   
    // Toggle de visibilidad de contraseña
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
           
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
   
    // Validación de formulario de Login
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginEmailGroup = document.getElementById('login-email-group');
    const loginPasswordGroup = document.getElementById('login-password-group');
    const loginSuccess = document.getElementById('login-success');
   
    loginEmail.addEventListener('input', validateLoginEmail);
    loginPassword.addEventListener('input', validateLoginPassword);
   
    function validateLoginEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(loginEmail.value)) {
            loginEmailGroup.classList.remove('invalid');
            loginEmailGroup.classList.add('valid');
            return true;
        } else {
            loginEmailGroup.classList.remove('valid');
            if (loginEmail.value.length > 0) {
                loginEmailGroup.classList.add('invalid');
            } else {
                loginEmailGroup.classList.remove('invalid');
            }
            return false;
        }
    }
   
    function validateLoginPassword() {
        if (loginPassword.value.length >= 1) {
            loginPasswordGroup.classList.remove('invalid');
            loginPasswordGroup.classList.add('valid');
            return true;
        } else {
            loginPasswordGroup.classList.remove('valid');
            loginPasswordGroup.classList.add('invalid');
            return false;
        }
    }
   
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
       
        const isEmailValid = validateLoginEmail();
        const isPasswordValid = validateLoginPassword();
       
        if (isEmailValid && isPasswordValid) {
            // Simulación de verificación de credenciales
            // En un caso real, esta verificación se haría en el servidor
            const mockServerCheck = setTimeout(() => {
                loginSuccess.style.display = 'block';
               
                // Simulación de redirección al dashboard
                setTimeout(() => {
                    alert('Redirigiendo al dashboard...');
                }, 1500);
            }, 1000);
        }
    });
   
    // Validación de formulario de Registro
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordRequirements = document.getElementById('password-requirements');
    const registerSuccess = document.getElementById('register-success');
   
    const firstnameGroup = document.getElementById('firstname-group');
    const lastnameGroup = document.getElementById('lastname-group');
    const emailGroup = document.getElementById('email-group');
    const passwordGroup = document.getElementById('password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
   
    // Requerimientos de contraseña
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');
   
    firstname.addEventListener('input', validateFirstname);
    lastname.addEventListener('input', validateLastname);
    email.addEventListener('input', validateEmail);
    password.addEventListener('focus', function() {
        passwordRequirements.classList.add('show');
    });
    password.addEventListener('blur', function() {
        passwordRequirements.classList.remove('show');
    });
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);
   
    function validateFirstname() {
        if (firstname.value.length > 0) {
            firstnameGroup.classList.remove('invalid');
            firstnameGroup.classList.add('valid');
            return true;
        } else {
            firstnameGroup.classList.remove('valid');
            firstnameGroup.classList.add('invalid');
            return false;
        }
    }
   
    function validateLastname() {
        if (lastname.value.length > 0) {
            lastnameGroup.classList.remove('invalid');
            lastnameGroup.classList.add('valid');
            return true;
        } else {
            lastnameGroup.classList.remove('valid');
            lastnameGroup.classList.add('invalid');
            return false;
        }
    }
   
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email.value)) {
            emailGroup.classList.remove('invalid');
            emailGroup.classList.add('valid');
            return true;
        } else {
            emailGroup.classList.remove('valid');
            if (email.value.length > 0) {
                emailGroup.classList.add('invalid');
            } else {
                emailGroup.classList.remove('invalid');
            }
            return false;
        }
    }
   
    function validatePassword() {
        const hasLength = password.value.length >= 8;
        const hasUppercase = /[A-Z]/.test(password.value);
        const hasLowercase = /[a-z]/.test(password.value);
        const hasNumber = /[0-9]/.test(password.value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
       
        // Actualizar los indicadores de requisitos
        updateRequirement(reqLength, hasLength);
        updateRequirement(reqUppercase, hasUppercase);
        updateRequirement(reqLowercase, hasLowercase);
        updateRequirement(reqNumber, hasNumber);
        updateRequirement(reqSpecial, hasSpecial);
       
        const isValid = hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
       
        if (isValid) {
            passwordGroup.classList.remove('invalid');
            passwordGroup.classList.add('valid');
        } else {
            passwordGroup.classList.remove('valid');
            if (password.value.length > 0) {
                passwordGroup.classList.add('invalid');
            } else {
                passwordGroup.classList.remove('invalid');
            }
        }
       
        // Si el campo de confirmación tiene contenido, validar que coincidan
        if (confirmPassword.value.length > 0) {
            validateConfirmPassword();
        }
       
        return isValid;
    }
   
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.remove('invalid');
            element.classList.add('valid');
            element.querySelector('i').className = 'fas fa-check';
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
            element.querySelector('i').className = 'fas fa-times';
        }
    }
   
    function validateConfirmPassword() {
        if (confirmPassword.value === password.value && confirmPassword.value.length > 0) {
            confirmPasswordGroup.classList.remove('invalid');
            confirmPasswordGroup.classList.add('valid');
            return true;
        } else {
            confirmPasswordGroup.classList.remove('valid');
            if (confirmPassword.value.length > 0) {
                confirmPasswordGroup.classList.add('invalid');
            } else {
                confirmPasswordGroup.classList.remove('invalid');
            }
            return false;
        }
    }
   
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
       
        const isFirstnameValid = validateFirstname();
        const isLastnameValid = validateLastname();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
       
        if (isFirstnameValid && isLastnameValid && isEmailValid &&
            isPasswordValid && isConfirmPasswordValid) {
            // Simulación de registro exitoso
            registerSuccess.style.display = 'block';
           
            // Simulación de redirección al login después del registro
            setTimeout(() => {
                container.classList.remove('show-register');
                registerSuccess.style.display = 'none';
                registerForm.reset();
               
                // Reiniciar estados de validación
                document.querySelectorAll('#register-form .input-group').forEach(group => {
                    group.classList.remove('valid', 'invalid');
                });
               
                // Reiniciar requisitos de contraseña
                document.querySelectorAll('.requirement').forEach(req => {
                    req.classList.remove('valid', 'invalid');
                    req.querySelector('i').className = 'fas fa-circle';
                });
            }, 2000);
        }
    });
});
