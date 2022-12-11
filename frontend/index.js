// import $ from "jquery";


// window.onload = (flights) => {
const flightLookup = (flight) => {
    axios.post('http://127.0.0.1:5000/', flight)
        .then(response => {
            avaliable_flights = response.data["response"]
            console.log(avaliable_flights)
            console.log('page is fully loaded');

            if (avaliable_flights.length == 0) {
                document.getElementById("showData").innerHTML = "<h1> No Flights Found Currently!!! </h1><br><br>"
                element = document.getElementById('showData');
                element.style.color = 'white';
            }
            else {
                let col = [];
                for (let i = 0; i < avaliable_flights.length; i++) {
                    for (let key in avaliable_flights[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                        }
                    }
                }
                col.push("Book");
                // console.log(col)
                const table = document.createElement("table");
                let tr = table.insertRow(-1);
                for (let i = 0; i < col.length; i++) {
                    let th = document.createElement("th");
                    th.innerHTML = col[i];
                    tr.appendChild(th);
                }

                for (let i = 0; i < avaliable_flights.length; i++) {
                    tr = table.insertRow(-1);

                    for (let j = 0; j < col.length; j++) {
                        let tabCell = tr.insertCell(-1);
                        // console.log("HEREEE");
                        // console.log(col[i]);
                        if (col[i] == "Book") {
                            console.log("FOUND");
                        }
                        tabCell.innerHTML = avaliable_flights[i][col[j]];
                    }
                }
                const showdata_ = document.getElementById('showData');
                showdata_.innerHTML = "";
                showdata_.appendChild(table);
            }
        })
};
// };

function searchTable() {
    const form = document.querySelector('form');

    const formEvent = form.addEventListener('submit', event => {
        event.preventDefault();

        const flight_from = document.querySelector('#flight_from').value;
        const flight_to = document.querySelector('#flight_to').value;
        const date = document.querySelector('#date').value;


        const flight = { flight_from, flight_to, date };
        flightLookup(flight);

    });
}


