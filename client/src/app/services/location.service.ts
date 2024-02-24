import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LocationArea, LocationRegion } from '@models/location.model';
import { Observable, map, takeLast, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private httpService: HttpService) { }

  public getAll(): Observable<{ area: LocationArea[], region: LocationRegion[] }> {
    const locationArea$ = this.httpService.get<LocationArea[]>('/api/location/area')
    const locationRegion$ = this.httpService.get<LocationRegion[]>('/api/location/region')

    return zip(locationArea$, locationRegion$)
      .pipe(
        takeLast(1),
        map(([area, region]) => ({ area, region })),
      );
  }
}
