export interface IChart {
  labels: string[];
  chartName: string;
  datasets: {
    labelName: string;
    data: number[];
  }[];
}
