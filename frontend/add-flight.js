// const createFlight = (flight) => {
//     axios.post('http://127.0.0.1:5000/register', flight)
//         .then(response => {
//             const addedflight = response.data;
//             console.log(`POST: flight is added`, addedflight);
//             console.log(flight)
//             window.location.href = "./login.html"
//         })
//         .catch(function (error) {
//             if (error.response) {
//                 alert(error.response.data["message"]);
//             }
//         });
// };


// function runform() {
//     const form = document.querySelector('form');

//     const formEvent = form.addEventListener('submit', event => {
//         event.preventDefault();
//         const fullname = document.querySelector('#fullname').value;
//         const email = document.querySelector('#email').value;
//         const contact_number = document.querySelector('#contact_number').value;
//         const password = document.querySelector('#password').value;
//         const repassword = document.querySelector('#repassword').value;
//         console.log(fullname, email, contact_number, password, repassword)
//         const flight = { fullname, email, contact_number, password };
//         createFlight(flight);

//     });
// }



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

//convert any url
function addFlight(flight) {
    let config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + getCookie("token"),
        }
    }
    axios.post('http://127.0.0.1:5000/add-flight', flight, config)
        .then(response => {
            short_url = response
            console.log(short_url.data)
            alert(response.data)
            // if (short_url.data["message"] == "User already searched for this URL.") {
            //     document.getElementById("main-form").innerHTML = "<br><br><h3>" + (short_url.data["message"]) + "</h3>"
            //     element = document.querySelector('h3');
            //     element.style.color = 'orange';
            // }
            // else {
            //     document.getElementById("changeh2").innerHTML = "<h3>" + (short_url.data["message"]) + "</h3>"
            //     element = document.getElementById('changeh2');
            //     element.style.color = 'orange';
            //     document.getElementById("postdata").innerHTML = "<h3>" + (short_url.data["short_link"]) + "</h3>"
            //     element = document.getElementById('postdata');
            //     element.style.color = 'orange';

            // }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function runFlight() {
    const form = document.querySelector('form');
    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();
        const flight_from = document.querySelector('#flight_from').value;
        const flight_to = document.querySelector('#flight_to').value;
        const airline = document.querySelector('#airline').value;
        const price = document.querySelector('#price').value;
        const date = document.querySelector('#date').value;
        const flight_class = document.querySelector('#flight_class').value;

        console.log(flight_from, flight_to, airline, price, date, flight_class)
        const flight = { flight_from, flight_to, airline, price, date, flight_class }
        addFlight(flight);
    });
}