function drawChart(id, data, dateTime,) {
  const myChart = new Chart(document.getElementById(id),

    {
      type: "line",
      data: {
        labels: dateTime,
        datasets: data
      },
      options: {
        title: {
          display: true,
          text: 'Temperature by Date'
        }
      }
    });
}


function createTable(label, data) {
  let tabel = document.getElementById('dataTable');
  let htmlString = `<thead><tr><th>No</th>`;
  for (let i = 0; i < label.length; i++) {
    htmlString += `<th>${label[i]}</th>`;
  }
  htmlString += `</tr></thead> <tbody>`;
  for (let i = 0; i < data[0].length; i++) {
    htmlString += `<tr><td>${i}</td>`;
   
    for (let j = 0; j < label.length; j++) {
      htmlString += `<td>${data[j][i]}</td>`;
    }
    htmlString += `</tr>`
  }
  htmlString += `</tbody>`
  tabel.innerHTML = htmlString;
}

function myTem() {
  const date_label = [];
  const temp_label = [];
  const onlyDateList = [];
  const timeList = [];
  fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature")
    .then(response => response.json())
    .then(data => {
      const sortedData = data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
      for (let i = 0; i < sortedData.length; i++) {
        let fullDate = sortedData[i].date_time;
        let listOfDate = fullDate.split("T");
        let onlyDate = listOfDate[0];
        let time = listOfDate[1].substring(0, 5);
        onlyDateList.push(onlyDate);
        timeList.push(time);

        date_label.push(`Date:${onlyDate} Time:${time}`);
        temp_label.push(sortedData[i].temperature);
      }

      dataset = [{
        label: 'Temperature',
        data: temp_label,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }];
      createTable(["Date", "Time", "Temperature" ], [onlyDateList, timeList, temp_label]);
      drawChart("myChart", dataset, date_label);
    });

}

window.onload = function () {
  myTem();
};