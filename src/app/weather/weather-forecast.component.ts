import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css'],
})
export class WeatherForecastComponent implements OnInit {
  public chart: any = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.buildChart();
  }

  async buildChart() {
    try {
      const responseColumbiaWeatherForecast = await this.fetchWeatherForecast(
        'https://api.weather.gov/gridpoints/LWX/31,80/forecast'
      );

      const responseKansasWeatherForecast = await this.fetchWeatherForecast(
        'https://api.weather.gov/gridpoints/TOP/31,80/forecast'
      );

      const datasetColumbia = this.createDataset(responseColumbiaWeatherForecast);
      const datasetKansas = this.createDataset(responseKansasWeatherForecast);

      const chartOptions = this.createChartOptions(datasetColumbia, datasetKansas);

      this.createChart(chartOptions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchWeatherForecast(url: string) {
    return await this.http.get(url).toPromise();
  }

  createDataset(response: any) {
    return response.properties.periods.map((period: any) => ({
      x: period.number,
      y: period.temperature,
    }));
  }

  createChartOptions(datasetColumbia: any[], datasetKansas: any[]) {
    return {
      type: 'line',
      data: {
        datasets: [
          this.createDatasetOptions('Columbia', datasetColumbia, 'red'),
          this.createDatasetOptions('Kansas', datasetKansas, 'blue'),
        ],
        labels: ["A", "B", "C", "D", "E", "F", "G"],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Periods',

            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Temperature (°F)',
            },
            suggestedMin: 30,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Weather Forecast',
            font: {
              size: 18,
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    };
  }

  createDatasetOptions(label: string, data: any[], borderColor: string) {
    return {
      label: label,
      data: data,
      borderColor: borderColor,
      fill: false,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: borderColor,
    };
  }

  createChart(options: any) {
    this.chart = new Chart('weather-forecast-chart', options);
  }
}
