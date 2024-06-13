import { Injectable } from '@nestjs/common';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { IChart } from '@/base/common/utils/image-chart.util';

interface IDatasetChart {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

@Injectable()
export class ChartService {
  private readonly width = 800;
  private readonly height = 400;
  private readonly chartJSNodeCanvas: ChartJSNodeCanvas;
  private readonly colors = [
    {
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    { borderColor: '#F28E2B', backgroundColor: 'rgba(242,142,43,0.5)' },
    { borderColor: '#E15759', backgroundColor: 'rgba(225,87,89,0.5)' },
    { borderColor: '#76B7B2', backgroundColor: 'rgba(118,183,178,0.5)' },
    { borderColor: '#59A14F', backgroundColor: 'rgba(89,161,79,0.5)' },
    { borderColor: '#EDC948', backgroundColor: 'rgba(237,201,72,0.5)' },
    { borderColor: '#B07AA1', backgroundColor: 'rgba(176,122,161,0.5)' },
    { borderColor: '#FF9DA7', backgroundColor: 'rgba(255,157,167,0.5)' },
    { borderColor: '#F1CE63', backgroundColor: 'rgba(241,206,99,0.5)' },
    { borderColor: '#9C755F', backgroundColor: 'rgba(156,117,95,0.5)' },
    { borderColor: '#BAB0AC', backgroundColor: 'rgba(186,176,172,0.5)' },
  ];
  constructor() {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: this.width,
      height: this.height,
    });
  }

  processedData(data: IChart) {
    const datasets: IDatasetChart[] = data.datasets.map((dataset, index) => {
      return {
        label: dataset.labelName,
        data: dataset.data,
        backgroundColor: this.colors[index].backgroundColor,
        borderColor: this.colors[index].borderColor,
        borderWidth: 1,
      };
    });
    return {
      datasets,
      labels: data.labels,
      chartName: data.chartName,
    };
  }
  async createLineChart(data: IChart) {
    const { datasets, labels, chartName } = this.processedData(data);

    const configChart: any = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [...datasets],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: chartName,
            font: {
              size: 18,
            },
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configChart);
  }

  async createBarChart(data: IChart, config?: any) {
    const { datasets, labels, chartName } = this.processedData(data);

    const configChart: any = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [...datasets],
      },
      options: {
        ...config,
        plugins: {
          title: {
            display: true,
            text: chartName,
            font: {
              size: 18,
            },
          },
        },
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        legend: {
          position: 'bottom' as const,
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configChart);
  }

  async createMixBarChart(data: IChart) {
    const { datasets, labels, chartName } = this.processedData(data);
    datasets[0]['yAxisID'] = 'y';
    datasets[1]['yAxisID'] = 'y1';
    const configChart: any = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [...datasets],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: chartName,
            font: {
              size: 18,
            },
          },
        },
        interaction: {
          mode: 'index' as const,
          intersect: false,
        },
        scales: {
          y: {
            display: true,
            position: 'left' as const,
          },
          y1: {
            display: true,
            position: 'right' as const,
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configChart);
  }

  async createPieChart(data: IChart) {
    const { datasets, labels, chartName } = this.processedData(data);
    datasets[0].backgroundColor = this.colors.map(
      (color) => color.backgroundColor,
    );
    datasets[0].borderColor = this.colors.map((color) => color.borderColor);

    const configChart: any = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [...datasets],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: chartName,
            font: {
              size: 18,
            },
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configChart);
  }
}
