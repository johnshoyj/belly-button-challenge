let data;

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(responseData => {

    // Assign the data to a variable
    data = responseData;

    // Populates the dropdown
    const dropdown = d3.select("#subject-select");
    data.names.forEach(subjectId => {
        dropdown.append("option").text(subjectId).property("value", subjectId);
    });

    // Starts charts with first name in list
    renderCharts(data.names[0]);
});

// Dropdown change event handler
window.onSubjectIdSelect = selectedSubjectId => {
    renderCharts(selectedSubjectId);
};

// Bubble chart design
const bubbleLayout = {
    title: {
        text: `Bubble Chart of Bacteria Per Sample`,
        font: {
            family: 'Arial, sans-serif',
            size: 24,
            bold: true
        }
    },
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' },
    showlegend: false,
};

// Gauge chart design and layout
const gaugeData = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0,
        title: {
            text: "Weekly Belly Button Wash Count",
            font: {
                family: 'Arial, sans-serif',
                size: 24,
                bold: true
            }
        },
        type: "indicator",
        mode: "gauge",
        gauge: {
            axis: { range: [0, 9] },
            bar: { color: '#337AB7' }
        },
    }
];

const gaugeLayout = {
    width: 400,
    height: 300,
    margin: { t: 55, b: 25, r: 25, l: 25 }
};

// Bar chart design
const barLayout = {
    title: {
        text: `Top 10 OTUs Per Sample`,
        font: {
            family: 'Arial, sans-serif',
            size: 24,
            bold: true
        }
    },
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU ID' },
};

// Update charts based on selected subject ID
function renderCharts(subjectId) {

    // Create index by ID
    const index = data.names.indexOf(subjectId);

    // Select top 10 OTUs 
    const top10Values = data.samples[index].sample_values.slice(0, 10).reverse();
    const top10Labels = data.samples[index].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const hoverTextBar = data.samples[index].otu_labels.slice(0, 10).reverse();

    // Bar chart data
    const barData = [{
        type: 'bar',
        x: top10Values,
        y: top10Labels,
        orientation: 'h',
        text: hoverTextBar,
    }];


    // Bubble chart data
    const bubbleData = [{
        x: data.samples[index].otu_ids,
        y: data.samples[index].sample_values,
        mode: 'markers',
        marker: {
            size: data.samples[index].sample_values,
            color: data.samples[index].otu_ids,
            colorscale: 'Viridis',
            opacity: 0.7,
        },
        text: data.samples[index].otu_labels,
    }];

    // Index metadata
    displayMetadata(data.metadata[index]);

    // Washing frequency data
    const washingFrequency = data.metadata[index].wfreq;

    // Update the gauge chart
    gaugeData[0].value = washingFrequency;

    // Update all plots
    Plotly.newPlot('bar', barData, barLayout);
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

}

// Display metadata
function displayMetadata(metadata) {

    // Select the "metadata" div
    const metadataDiv = d3.select("#metadata");

    // Clear existing content
    metadataDiv.html("");

    // Update metadata
    Object.keys(metadata).forEach(key => {
        metadataDiv.append("p").text(`${capitalizeFirstLetter(key)}: ${metadata[key]}`);
    });
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}