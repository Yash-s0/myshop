//  Register a new user 
//  Link to server
const createUser = (user) => {
    axios.post('http://127.0.0.1:5000/register', user)
        .then(response => {
            const addedUser = response.data;
            console.log(`POST: user is added`, addedUser);
            console.log(user)
            window.location.href = "./login.html"
        })
        .catch(function (error) {
            if (error.response) {
                alert(error.response.data["message"]);
            }
        });
};

// Taking arguments from user 
function runform() {
    const form = document.querySelector('form');

    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();
        const fullname = document.querySelector('#fullname').value;
        const email = document.querySelector('#email').value;
        const contact_number = document.querySelector('#contact_number').value;
        const password = document.querySelector('#password').value;
        const repassword = document.querySelector('#repassword').value;
        console.log(fullname, email, contact_number, password, repassword)
        const user = { fullname, email, contact_number, password };
        createUser(user);

    });
}