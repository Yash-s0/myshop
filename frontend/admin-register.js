//  Register a new admin 
//  Link to server
const createAdmin = (admin) => {
    axios.post('http://127.0.0.1:5000/admin-register', admin)
        .then(response => {
            const addedAdmin = response.data;
            if (addedAdmin["success"] == true) {
                alert(addedAdmin["message"])
                window.location.href = "./admin-login.html"
            }

            else if (addedAdmin["message"] == "You are not authorised to register as an admin.") {
                alert("You are not authorised to register as an admin.")
                window.location.href = "./index.html"
            }
            else if (addedAdmin["message"] == "Admin already exists!!! Please Login...") {
                alert("Admin already exists!!! Please Login...")
                window.location.href = "./admin-login.html"
            }
        })
        .catch(function (error) {
            if (error.response) {
                alert(error.response.data["message"]);
            }
        });
};

// Taking arguments from admin 
function addAdmin() {
    const form = document.querySelector('form');

    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();
        const admin_name = document.querySelector('#admin_name').value;
        const code = document.querySelector('#code').value;
        const password = document.querySelector('#password').value;
        console.log(admin_name, code, password)
        const admin = { admin_name, code, password };
        createAdmin(admin);

    });
}