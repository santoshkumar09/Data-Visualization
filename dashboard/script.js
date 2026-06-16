/* SECTION SWITCHING */
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
}

/* LOAD CSV */
Plotly.d3.csv("traffic_dataset_with_trend.csv", function(err, data) {

    if (err) {
        console.error("Error loading CSV:", err);
        return;
    }

    // Convert strings to usable JS arrays
    let timestamps = data.map(row => row.Timestamp);
    let traffic = data.map(row => Number(row["Traffic Volume"]));
    let weather = data.map(row => row.Weather);
    let events = data.map(row => row.Events === "True");

    /* ============================================================
       OVERVIEW CHART (Full Year Traffic)
    ============================================================ */
    let overviewTrace = {
        x: timestamps,
        y: traffic,
        type: "scatter",
        mode: "lines",
        line: { color: "#ff6600", width: 2 }
    };

    Plotly.newPlot("overviewPlot", [overviewTrace], {
        title: "Total Traffic Volume Overview (Full Year)",
        xaxis: { title: "Date" },
        yaxis: { title: "Traffic Volume" }
    });

    /* ============================================================
       TIME SERIES PLOT
    ============================================================ */
    let timeSeries = {
        x: timestamps,
        y: traffic,
        type: "scatter",
        mode: "lines",
        line: { width: 2, color: "#0057ff" }
    };

    Plotly.newPlot("timeSeriesPlot", [timeSeries], {
        title: "Hourly Traffic Volume in 2023",
        xaxis: { title: "Date" },
        yaxis: { title: "Traffic Volume" }
    });

    /* ============================================================
       WEATHER IMPACT
    ============================================================ */
    let clear = data.filter(r => r.Weather === "Clear");
    let cloudy = data.filter(r => r.Weather === "Cloudy");
    let rain = data.filter(r => r.Weather === "Rain");

    let weatherTrace = [
        {
            x: clear.map(r => r.Timestamp),
            y: clear.map(r => r["Traffic Volume"]),
            mode: "markers",
            name: "Clear"
        },
        {
            x: cloudy.map(r => r.Timestamp),
            y: cloudy.map(r => r["Traffic Volume"]),
            mode: "markers",
            name: "Cloudy"
        },
        {
            x: rain.map(r => r.Timestamp),
            y: rain.map(r => r["Traffic Volume"]),
            mode: "markers",
            name: "Rain"
        }
    ];

    Plotly.newPlot("weatherPlot", weatherTrace, {
        title: "Weather vs Traffic Volume"
    });

    /* ============================================================
       EVENT ANALYSIS
    ============================================================ */
    let eventTrue = data.filter(r => r.Events === "True");
    let eventFalse = data.filter(r => r.Events === "False");

    let eventTrace = [
        {
            y: eventTrue.map(r => r["Traffic Volume"]),
            type: "box",
            name: "Event Day"
        },
        {
            y: eventFalse.map(r => r["Traffic Volume"]),
            type: "box",
            name: "Normal Day"
        }
    ];

    Plotly.newPlot("eventPlot", eventTrace, {
        title: "Traffic Volume: Event vs Non-Event Days"
    });

    /* ============================================================
       HEATMAP
    ============================================================ */
    let hours = timestamps.map(t => new Date(t).getHours());
    let days = timestamps.map(t => new Date(t).getDay());

    let heatmapData = [{
        x: hours,
        y: days,
        z: traffic,
        type: 'heatmap',
        colorscale: "Jet"
    }];

    Plotly.newPlot("heatmapPlot", heatmapData, {
        title: "Traffic Heatmap (Hour vs Day)",
        xaxis: { title: "Hour of Day" },
        yaxis: { title: "Day of Week" }
    });
});
