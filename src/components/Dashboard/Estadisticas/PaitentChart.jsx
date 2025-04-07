import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const PatientChart = ({ pacientesMas, pacientesFem }) => {
  useEffect(() => {
    if (document.querySelector('#patient-chart')) {
      const sColStackedOptions = {
        chart: {
          height: 230,
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '15%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: 'Masculino',
            color: '#2E37A4',
            data: pacientesMas,
          },
          {
            name: 'Femenino',
            color: '#00D3C7',
            data: pacientesFem,
          },
        ],
        xaxis: {
          categories: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ],
        },
      };

      const chart = new ApexCharts(
        document.querySelector('#patient-chart'),
        sColStackedOptions
      );

      chart.render();
    }
  }, [pacientesFem, pacientesMas]);

  return <div id="patient-chart"></div>;
};

export default PatientChart;