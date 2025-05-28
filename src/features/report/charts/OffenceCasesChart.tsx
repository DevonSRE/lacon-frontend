import React from "react";
import Chart from "./Chart";

const data = {
    categories: [
        "Assault", "Assault", "Land Dispute", "Assault", "Assault", "Land Dispute", "Assault", "Theft"
    ],
    series: [
        {
            name: "Criminal Cases",
            data: [240, 0, 170, 0, 160, 0, 0, 0],
        },
        {
            name: "Civil Cases",
            data: [0, 200, 0, 225, 40, 200, 0, 225],
        },
    ],
};

const OffenceCasesChart = () => {
    return (
        <div className="mt-6">
            <h1 className="text-left font-semibold text-xl text-black">Cases by Type of Offence/Complaint</h1>
            <Chart categories={data.categories} series={data.series} colors={["#6D7E9C", "#1D2B39"]} />
        </div>
    );
};

export default OffenceCasesChart;
