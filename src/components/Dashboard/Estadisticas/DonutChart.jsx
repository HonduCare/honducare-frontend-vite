import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const DonutChart = ({ patologias }) => {
  useEffect(() => {
    if (document.querySelector('#donut-chart-dash')) {
      const donutChartOptions = {
        chart: {
          height: 290,
          type: 'donut',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        series: patologias.patologiasNumber,
        labels: patologias.patologiasLabel,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        legend: {
          position: 'bottom',
        },
      };

      const donut = new ApexCharts(
        document.querySelector('#donut-chart-dash'),
        donutChartOptions
      );

      donut.render();
    }
  }, []);

  return <div id="donut-chart-dash"></div>;
};

export default DonutChart;