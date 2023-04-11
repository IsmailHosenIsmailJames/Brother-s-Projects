const content = document.getElementById("temperature_tbody");
const date_label = [];
const temp_label = [];
fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature")
    .then(response => response.json())
    .then(data => {
        const sortedData = data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
        sortedData.reverse();

        for (let i = 0; i < sortedData.length; i++) {
            let skeleton = "<tr class='row'>";
            skeleton += "<td>" + parseInt(i + 1) + "</td>";
            skeleton += "<td>" + sortedData[i].date_time.replace("T", ", ").replace("Z", "").slice(0, 10) + "</td>";
            skeleton += "<td>" + sortedData[i].date_time.replace("T", ", ").replace("Z", "").slice(11) + "</td>";
            skeleton += "<td>" + sortedData[i].temperature + "</td>";
            skeleton += "</tr>";
            content.innerHTML += skeleton;

            date_label.push(sortedData[i].date_time);
            temp_label.push(sortedData[i].temperature);
        }

        const myChart = new Chart("myChart", {
            type: "bar",
            data: {
                labels: date_label,
                datasets: [{
                    data: temp_label,
                    borderColor: 'blue'
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Temperature by Date'
                }
            }
        });
    });
