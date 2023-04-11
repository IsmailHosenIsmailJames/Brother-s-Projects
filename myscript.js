function drawChart(id,data, dateTime, ){
  const myChart = new Chart(document.getElementById(id),

     {
    type: "line",
    datasets: {
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

function myTem() {
  const date_label = [];
  const temp_label = [];
  fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/temperature")
    .then(response => response.json())
    .then(data => {
      const sortedData = data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
      for (let i = 0; i < sortedData.length; i++) {
        let fullDate = sortedData[i].date_time;
        let listOfDate = fullDate.split("T");
        let onlyDate = listOfDate[0];
        let time = listOfDate[1].substring(0, 5);
        
        date_label.push(`D: ${onlyDate} T: ${time}`);
        temp_label.push(sortedData[i].temperature);
      }

      dataset = [{
        data: temp_label,
        borderColor: 'blue'
      }]

     drawChart("myChart", dataset, date_label)
    });

}

window.onload = function () {
  myTem();
};