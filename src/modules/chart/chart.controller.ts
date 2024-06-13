import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChartService } from './chart.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

}
