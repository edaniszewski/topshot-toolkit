
function onMomentsPageLoad() {
  initialize();
}

function isMomentListLoaded() {
  return document.getElementById("moment-detailed-serialNumber") != null;
}

function isMomentDataLoaded() {
  var dropdown = document.getElementById("moment-detailed-serialNumber");
  var tables = document.getElementsByClassName("TableStyles__Table-sc-1saikeo-1");
  return (dropdown != null) && (tables.length == 1)
}


function initialize() {
  runAfter(isMomentListLoaded, 50, 5000, () => {
    chrome.storage.sync.get(["momentsEnableSort"], (result) => {
      if (result.momentsEnableSort) {
        // Wait a short period of time to improve reliability of DOM manipulation
        // and updates. Since the page loads dynamically, this helps ensure everything
        // we need is present.
        setTimeout(initializeMomentSort, 250);
      }
    });
  });

  runAfter(isMomentDataLoaded, 50, 5000, () => {
    chrome.storage.sync.get(["momentsShowChart"], (result) => {
      if (result.momentsShowChart) {
        // Wait a short period of time to improve reliability of DOM manipulation
        // and updates. Since the page loads dynamically, this helps ensure everything
        // we need is present.
        setTimeout(initializeMomentChart, 250);
      }
    });
  });
}

function initializeMomentSort() {
  var dropdown = document.getElementById("moment-detailed-serialNumber")
  var optionsList = dropdown.options;
  for (var i = 0; i < optionsList.length; i++) {
      price = optionsList[i].text.split('-')[1]
      price = price.split('(')[0]
      price = price.replace(/\s|,|\$/g, '')
      price = parseFloat(price)
      optionsList[i].ask = price
  }

  if (document.getElementById("tstk-sort-by") == null) {
    // Check storage for the sort preference.
    chrome.storage.sync.get("tstk-sort-preference", (obj) => {
      var sortPreference = "serial";

      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        chrome.storage.sync.set({"tstk-sort-preference": sortPreference});
      } else {
        sortPreference = obj["tstk-sort-preference"];
      }

      var optSerial = document.createElement("option")
      optSerial.value = "serial";
      optSerial.innerText = "serial";

      var optAsk = document.createElement("option")
      optAsk.value = "ask";
      optAsk.innerText = "ask";

      var selectElem = document.createElement("select")
      selectElem.id = "tstk-moment-sort-by";
      selectElem.className = "Select__StyledSelect-gtic5k-1 eockBW";
      selectElem.appendChild(optSerial);
      selectElem.appendChild(optAsk);
      selectElem.onchange = changeSort;
      selectElem.value = sortPreference;

      var dropdownWrapper = document.createElement("div");
      dropdownWrapper.className = "Select__Root-gtic5k-0 cfWOFF";
      dropdownWrapper.innerHTML = '<svg width="16" height="16" fill="#a7aebb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="Icon__StyledSvg-sc-1rdji9f-0 fqjHM Select__StyledAngle-gtic5k-2 jQiBIL"><path d="M11.918 15.586L6.137 9.852a.47.47 0 010-.665l.773-.773a.47.47 0 01.664 0l4.676 4.629 4.676-4.629a.47.47 0 01.664 0l.773.774a.47.47 0 010 .664l-5.781 5.734a.47.47 0 01-.664 0z" fill-rule="nonzero"></path></svg>';
      dropdownWrapper.appendChild(selectElem);

      var label = document.createElement("span");
      label.color = "#a7aebb";
      label.className = "Label-sc-1c0wex9-0 jVbMit";
      label.innerText = "sort by";

      var wrapper = document.createElement("div");
      wrapper.id = "tstk-sort-by"
      wrapper.className = "guHmTC";
      wrapper.appendChild(label);
      wrapper.appendChild(dropdownWrapper);

      var outer = dropdown.parentElement.parentElement.parentElement;
      outer.parentElement.insertBefore(wrapper, outer);

      changeSort();
    });
  }
}

function changeSort() {
  var selectElem = document.getElementById("tstk-moment-sort-by");
  chrome.storage.sync.set({"tstk-sort-preference": selectElem.value});
  sortMoments(selectElem.value);
}

function sortMoments(sortBy) {
  var dropdown = document.getElementById('moment-detailed-serialNumber');

  var startIdx = 0;
  if (dropdown.childNodes[0].innerText.includes('Select a Serial Number')) {
      startIdx = 1;
  }

  var optionsList = dropdown.options;
  var newList = [];
  for (var i = startIdx; i < optionsList.length; i++) {
      newList.push(optionsList[i]);
  }

  // todo: switch?
  if (sortBy == "ask") {
      newList = newList.sort((a, b) => {
          if (parseFloat(a.ask) === parseFloat(b.ask)) {
            return 0;
          }
          else {
              return (parseFloat(a.ask) < parseFloat(b.ask)) ? -1 : 1;
          }
      });
  }
  else if (sortBy == "serial") {
      newList = newList.sort((a, b) => {
          if (parseInt(a.value) === parseInt(b.value)) {
              return 0;
          }
          else {
              return (parseInt(a.value) < parseInt(b.value)) ? -1 : 1;
          }
      });
  }

  // replace listing with their sorted correspondants
  for (var i = startIdx; i <= optionsList.length; i++) {
      optionsList[i] = newList[i];
  }
  optionsList[0].selected = true;
}





// Sort array in ascending order.
const asc = arr => arr.sort((a, b) => a - b);

// Get the specified quantile for the array of data points.
const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

// Filter outliers from the data set.
function filterOutliers(someArray) {
  if(someArray.length < 4)
    return someArray;

  let values, q1, q3, iqr, maxValue, minValue;

  values = someArray.slice().sort( (a, b) => a - b); //copy array fast and sort

  if((values.length / 4) % 1 === 0){ //find quartiles
    q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
    q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)];
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
  }

  iqr = q3 - q1;
  maxValue = q3 + iqr * 1.2;
  minValue = q1 - iqr * 1.2;

  return values.filter((x) => (x >= minValue) && (x <= maxValue));
}


function initializeMomentChart() {
  if (document.getElementById("tstk-chart-container") == null) {
    elems = document.getElementsByClassName('Insertsstyles__Row-sc-11i7qci-1')
    pricesParent = elems[0]

    var dropdown = document.getElementById('moment-detailed-serialNumber');
    var optionsList = dropdown.options;

    var newOptionsList = []
    var dataSet = []

    for (var i = 0; i < optionsList.length; i++) {
      // Get the moment number. This will be plotted on the x-axis of the chart.
      momentNumber = optionsList[i].value

      // Get the price
      price = optionsList[i].text.split('-')[1]
      price = price.split('(')[0]
      price = price.replace(/\s|,|\$/g, '')
      price = parseFloat(price)
      optionsList[i].price = price

      // Store the data points in the data set.
      dataSet.push({
        x: parseInt(momentNumber),
        y: price,
      })
    }

    // Next, collect data from the latest sales.
    recentSales = document.getElementsByClassName("TableStyles__Table-sc-1saikeo-1")[0]
    recentSalesBody = recentSales.getElementsByTagName('tbody')[0]
    rows = recentSalesBody.getElementsByTagName('tr')

    top3Sales = []
    otherSales = []
    for (var i = 0; i < rows.length; i++) {
      price = rows[i].children[2].innerText
      serial = rows[i].children[3].innerText

      price = price.split('#')[0]
      price = price.replace(/\s|,|\$/g, '')
      price = parseFloat(price)

      serial = serial.replace(/\s|#/g, '')
      serial = parseInt(serial)

      if (i < 3) {
        top3Sales.push({
          x: serial,
          y: price
        })
      } else {
        otherSales.push({
          x: serial,
          y: price
        })
      }
    }

    ar = Array.from(dataSet, i => i.y)
    fltrd = filterOutliers(ar)
    q90 = quantile(ar, 0.87)
    fltrSet = new Set(fltrd);

    normalizedDataSet = []
    for (var i = 0; i < dataSet.length; i++) {
      if (dataSet[i].y < q90) {
        normalizedDataSet.push(dataSet[i])
      }
    }

    pricePointSize = 2
    if (normalizedDataSet.length <= 75) {
      pricePointSize = 4
    }

    pricesParent.insertAdjacentHTML('afterend', '<div id="tstk-chart-container" class="Insertsstyles__Row-sc-11i7qci-1 gUaupL"><div class="chart-container"><canvas id="myChart" style="width:100%;"></canvas></div></div>')

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
              {
                  label: 'Top 3',
                  data: top3Sales,
                  pointBackgroundColor: '#ff5b32',
                  borderColor: '#ff5b32',
                  borderWidth: 1,
                  pointRadius: pricePointSize,
                  fill: false,
              },
              {
                  label: 'Latest',
                  data: otherSales,
                  pointBackgroundColor: '#ffc232',
                  borderColor: '#ffc232',
                  borderWidth: 1,
                  pointRadius: pricePointSize,
                  fill: false,
              },
              {
                  label: 'Ask',
                  data: normalizedDataSet,
                  pointBackgroundColor: '#325fff',
                  borderColor: '#325fff',
                  borderWidth: 1,
                  pointRadius: pricePointSize,
                  fill: false,
              }
            ]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    display: true,
                    type: 'linear',
                    position: 'bottom',
                }]
            }
        }
    });
  }
}
