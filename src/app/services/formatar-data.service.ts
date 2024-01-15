import { Injectable } from '@angular/core';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class FormatarDataService {

  constructor() { }

  formatarData(data: Date): string {
    return format(data, 'dd/MM/yyyy');
  }
}
