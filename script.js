let listTypeOfData = [];

let last500DataFullDate = [];
let last500DataTime = [];
let last500DataOnlyDate = [];
let last500Data = [];

let jsonData = {};

fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/names")
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      listTypeOfData.push(data[i].name);
    }
  });

  
function initWindow() {

  fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
    .then(response => response.json())
    .then(data => {
      const sortedData = data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
      for (let i = 0; i < sortedData.length; i++) {
        let fullDate = sortedData[i].date_time;
        let listOfDate = fullDate.split("T");
        let onlyDate = listOfDate[0];
        let time = listOfDate[1].substring(0, 5);
        last500DataOnlyDate.push(onlyDate);
        last500DataTime.push(time);
        last500DataFullDate.push(`Date: ${onlyDate} Time: ${time}`);
        last500Data.push(sortedData[i].data);
        // date_label.push(`Date:${onlyDate} Time:${time}`);
        // temp_label.push(sortedData[i].temperature);
      }
      for (let i = 0; i < last500Data.length; i++) {
        const element = last500Data[i];
        for (let key in element) {
          if (jsonData.hasOwnProperty(key)) {
            let list = jsonData[key];
            list.push(element[key]);
          } else {
            jsonData[key] = [element[key]];
          }
        }

      }
      let dataForTable = [last500DataOnlyDate, last500DataTime];
      let labelForTable = ["Date", "Time"];
      let dataset = [];
      let colurCount = 0;
      let color = ['rgb(0, 0, 0)', 'rgb(54, 209, 205)', 'rgb(0, 131, 235)', 'rgb(54, 154, 135)', 'rgb(54, 206, 95)', 'rgb(50, 135, 200)', 'rgb(54, 135, 196)', 'rgb(54, 235, 149)', 'rgb(54, 235, 127)', 'rgb(82, 235, 54)'];
      let ignoredDataType = ['wind_speed', 'light', 'temperature','humidity_in', 'humidity_out', ]
      for (let i = 0; i < listTypeOfData.length; i++) {
        if (ignoredDataType.indexOf(listTypeOfData[i]) != -1) {
          dataForTable.push(jsonData[listTypeOfData[i]]);
          labelForTable.push(listTypeOfData[i]);
          dataset.push({
            label: listTypeOfData[i],
            data: jsonData[listTypeOfData[i]].slice(0, 30),
            fill: false,
            borderColor: color[colurCount],
            tension: 0.1
          });
          colurCount++;
        }



      }
      createTable(labelForTable, dataForTable);
      drawChart("myChart", dataset, last500DataFullDate.slice(0, 30));
    });
}

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


function createTable(label, data, length = 30) {
  let tabel = document.getElementById('dataTable');
  let htmlString = `<thead><tr><th>No</th>`;
  for (let i = 0; i < label.length; i++) {
    htmlString += `<th>${label[i]}</th>`;
  }
  htmlString += `</tr></thead> <tbody>`;
  for (let i = 0; i < length; i++) {
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
      createTable(["Date", "Time", "Temperature"], [onlyDateList, timeList, temp_label]);
      drawChart("myChart", dataset, date_label);
    });

}


function lastHour(apiLink, type, hour) {
  const date_label = [];
  const temp_label = [];
  const onlyDateList = []
  const timeList = []
  fetch(apiLink)
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
        temp_label.push(sortedData[i][type]);
      }
      dataset = [{
        label: type,
        data: temp_label,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }];

      drawChart('myChart', dataset, date_label)
      createTable(['Date', 'Time', type], [onlyDateList, timeList, temp_label], hour)

    });

}

function weatherNow(apiLink, type) {
  fetch(apiLink)
    .then(response => response.json())
    .then(data => {
      const jsonData = data;
      const singleData = jsonData[0][type];
      const dateTime = new Date(jsonData[0].date_time);
      const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      document.getElementById("time").textContent = time;
      document.getElementById("weather").textContent = `${type.replace('_', " ")} : ${singleData}`;
    });

  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let tabel = document.getElementById('dataTable');
  tabel.innerHTML = '';


}

window.onload = function () {
  initWindow();
};