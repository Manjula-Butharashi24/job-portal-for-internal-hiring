import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { Application } from '../../core/models/models';

@Pipe({ name: 'min' })
export class MinPipe implements PipeTransform {
  transform(value: [number, number]): number {
    return Math.min(value[0], value[1]);
  }
}

@Pipe({ name: 'filterByStatus' })
export class FilterByStatusPipe implements PipeTransform {
  transform(apps: Application[], status: string): number {
    return apps.filter(a => a.status === status).length;
  }
}
