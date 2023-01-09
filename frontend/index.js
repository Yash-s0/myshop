var date_filed;
var flight_class_field;
var flight_from_field;
var flight_id_field;
var flight_to_field;
var airline_filed;
var price_filed;

const flightLookup = (flight) => {
    axios.post('http://127.0.0.1:5000/', flight)
        .then(response => {
            avaliable_flights = response.data["response"]
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
                        // console.log(col[i]);
                        tabCell.innerHTML = avaliable_flights[i][col[j]];
                    }
                }
                const showdata_ = document.getElementById('showData');
                showdata_.innerHTML = "";
                showdata_.appendChild(table);

                // recognizing clicks on the table
                var rows = table.getElementsByTagName("tr");
                for (i = 0; i < rows.length; i++) {
                    var currentRow = table.rows[i];
                    var createClickHandler = function (row) {
                        return function () {
                            var cell = row.getElementsByTagName("td")[0];
                            console.log(cell)
                            alert(cell)
                            window.location.href = "http://127.0.0.1:5500/frontend/booking.html";

                            date_filed = cell.parentNode.cells["1"].innerHTML;
                            console.log(date_filed)
                            alert("Date: " + date_filed)

                            var date = form.elements.date;
                            date.value = data.date_filed;
                            form.submit();
                            var form = document.getElementById('myForm');

                        };
                    };
                    currentRow.onclick = createClickHandler(currentRow);

                }

            }
        })
};

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




