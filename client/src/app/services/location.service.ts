import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { LocationArea, LocationRegion } from "@models/location.model";
import { Observable, map, takeLast, zip } from "rxjs";
import { HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(private httpService: HttpService) { }

    public getAll(): Observable<{ area: LocationArea[] | null, region: LocationRegion[] | null } | null> {
        const locationArea$: Observable<LocationArea[] | null> = this.httpService.get<LocationArea[] | null>('/api/location/area').pipe(
            takeLast(1),
            map((response: HttpResponse<LocationArea[] | null>) => response.body)
        )
        const locationRegion$: Observable<LocationRegion[] | null> = this.httpService.get<LocationRegion[] | null>('/api/location/region').pipe(
            takeLast(1),
            map((response: HttpResponse<LocationRegion[] | null>) => response.body)
        )

        return zip(locationArea$, locationRegion$).pipe(
            takeLast(1),
            map(([ area, region ]) => ({ area, region }))
        )
    }
}