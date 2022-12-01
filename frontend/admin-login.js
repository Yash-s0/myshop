// Login admin
const LoginAdmin = (admin) => {
    axios.post('http://127.0.0.1:5000/admin-login', admin)
        .then(response => {
            const loginadmin_ = response.data;
            console.log(loginadmin_);
            if (loginadmin_["success"] == true) {
                setCookie("token", loginadmin_["bearer_token"], 1)
                alert("LOGGED IN ADMIN")
                window.location.href = "./add-flight.html"
                console.log(getCookie("token"))
            }

            else if (loginadmin_["message"] == "Admin does not exist!!! Please Register...") {
                alert("Admin does not exist!!! Please Register...")
                window.location.href = "./admin-register.html"
            }
            else {
                alert("Incorrect password.")
                window.location.href = "./login.html"
            }

        })
        .catch(function (error) {
            if (error.response) {
                alert(error.response.data["message"]);
            }
        });
};

function Loginform() {
    const form = document.querySelector('form');

    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();

        const admin_name = document.querySelector('#admin_name').value;
        const password = document.querySelector('#password').value;

        const admin = { admin_name, password };
        LoginAdmin(admin);

    });
}

// Set cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Get cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}