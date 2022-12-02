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

function addFlight(flight) {
    let config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + getCookie("token"),
        }
    }
    axios.post('http://127.0.0.1:5000/add-flight', flight, config)
        .then(response => {
            console.log(response.data["message"])
            if (response.data["success"] == true) {
                alert(response.data["message"])
            }
            else if (response.data["message"] == "Session expried, please login") {
                alert("Restricted for Admin Only / Session expried, please login.")
            }
            else if (response.data["message"] == "Signature expired. Please log in again.") {
                alert("Signature expired. Please log in again.")
            }
            else if (response.data["message"] == "Flight already added.") {
                alert("Flight already added...")
            }
        })
        .catch(function (error) {
            console.log(error.response.data["message"]);
            alert(error.response.data["message"]);
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