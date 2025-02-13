import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import climateData from '../data/climateData.json'; // ✅ Fixed import path

// Register required components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DataExplorer = () => {
    const [startYear, setStartYear] = useState(2018);
    const [endYear, setEndYear] = useState(2020);
    const [region, setRegion] = useState('global');
    const [metric] = useState('CO2 Emissions'); // ✅ Removed unused setMetric
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        let data = climateData.filter((item) => {
            return (
                item.year >= startYear &&
                item.year <= endYear &&
                (region === 'global' || item.country === region)
            );
        });

        // Calculate global average if region is 'global'
        if (region === 'global') {
            const groupedByYear = {};
            data.forEach((item) => {
                const year = item.year;
                if (!groupedByYear[year]) {
                    groupedByYear[year] = { total: 0, count: 0 };
                }
                groupedByYear[year].total += parseFloat(item.value || 0);
                groupedByYear[year].count += 1;
            });

            data = Object.keys(groupedByYear).map((year) => ({
                year: parseInt(year),
                country: 'Global',
                value: groupedByYear[year].total / groupedByYear[year].count,
            }));
        }

        setFilteredData(data);
    }, [startYear, endYear, region]);

    return (
        <div style={{ margin: '20px' }}>
            <h1>Climate Data Explorer</h1>

            {/* Filters */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Start Year:
                    <input
                        type="number"
                        value={startYear}
                        onChange={(e) => setStartYear(parseInt(e.target.value))}
                    />
                </label>

                <label style={{ marginLeft: '20px' }}>
                    End Year:
                    <input
                        type="number"
                        value={endYear}
                        onChange={(e) => setEndYear(parseInt(e.target.value))}
                    />
                </label>

                <label style={{ marginLeft: '20px' }}>
                    Region:
                    <select value={region} onChange={(e) => setRegion(e.target.value)}>
                        <option value="global">Global</option>
                        {Array.from(new Set(climateData.map((item) => item.country)))
                            .filter((country) => country)
                            .sort()
                            .map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))}
                    </select>
                </label>
            </div>

            {/* Plot */}
            <Plot
                key={`${region}-${startYear}-${endYear}`}
                data={[
                    {
                        x: filteredData.map((item) => item.year),
                        y: filteredData.map((item) => parseFloat(item.value || 0)),
                        mode: 'lines+markers',
                        type: 'scatter',
                        name: region === 'global' ? 'Global Average' : region,
                    },
                ]}
                layout={{
                    title: `${metric} Trends (${region})`,
                    xaxis: { title: 'Year', tickmode: 'linear' },
                    yaxis: { title: metric },
                }}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
};

export default DataExplorer;
