window.onload = (flights) => {
    axios.post('http://127.0.0.1:5000/')
        .then(response => {
            flights = response.data
            console.log(flights)
            console.log('page is fully loaded');

            if (flights.length == 0) {
                document.getElementById("showData").innerHTML = "<h1> No Flights Found Currently!!! </h1><br><br>"
            }
            else {
                let col = [];
                for (let i = 0; i < flights.length; i++) {
                    for (let key in flights[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                        }
                    }
                }
                console.log(col)
                console.log(col)
                const table = document.createElement("table");
                let tr = table.insertRow(-1);
                for (let i = 0; i < col.length; i++) {
                    let th = document.createElement("th");
                    th.innerHTML = col[i];
                    tr.appendChild(th);
                }

                for (let i = 0; i < flights.length; i++) {
                    tr = table.insertRow(-1);

                    for (let j = 0; j < col.length; j++) {
                        let tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = flights[i][col[j]];
                    }
                }
                const showdata_ = document.getElementById('showData');
                showdata_.innerHTML = "";
                showdata_.appendChild(table);
            }
        })

};