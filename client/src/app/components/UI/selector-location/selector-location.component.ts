import { MobileSelectorComponent } from '@MUI/mobile-selector/mobile-selector.component';
import { IMobileOptionItem, IMobileSelectOptionEvent } from '@MUI/mobile-selector/mobile-selector.interface';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LocationArea, LocationRegion } from '@models/location.model';
import { Observable, of, take, zip } from 'rxjs';

@Component({
  selector: 'app-selector-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MobileSelectorComponent,
    MyButtonComponent,
  ],
  templateUrl: './selector-location.component.html',
  styleUrl: './selector-location.component.scss'
})
export class SelectorLocationComponent {
  @Input() formControlArea: FormControl<string> = new FormControl<string>('', { nonNullable: true });
  @Input() formControlRegion: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  @Input() areaList$: Observable<LocationArea[]> = of([]);
  @Input() regionList$: Observable<LocationRegion[]> = of([]);

  public isMobileSelectorShow: boolean = false;
  public mobileOptionList$: Observable<IMobileOptionItem[]> = of([]);

  private getLocationOptionList(): Observable<IMobileOptionItem[]> {
    return new Observable((subscriber) => {
      zip([this.areaList$, this.regionList$]).subscribe(([areaList, regionList]) => {
        const mobileLocationChildrenList = regionList.reduce((optionList: IMobileOptionItem[], region: LocationRegion) => {
          return [...optionList, {
            id: region._id,
            name: region.name,
            children: [],
          }]
        }, [])

        const mobileLocationList = areaList.reduce((optionList: IMobileOptionItem[], area: LocationArea) => {
          return [...optionList, {
            id: area._id,
            name: area.name,
            children: mobileLocationChildrenList.filter(c => area.children.includes(c.id)),
          }]
        }, [])

        subscriber.next(mobileLocationList);
      })
    })
  }

  public openSelectLocation() {
    this.mobileOptionList$ = this.getLocationOptionList();
    this.isMobileSelectorShow = true;
  }

  public onSelect(event: IMobileSelectOptionEvent<IMobileOptionItem>): void {
    if (!event) {
      this.isMobileSelectorShow = false;
      return;
    }
    this.areaList$.pipe(take(1)).subscribe((areaList: LocationArea[]) => {
      const area = areaList.find(ar => ar.children.includes(event.value.id));
      this.formControlArea.setValue(area?._id ?? '');
      this.formControlRegion.setValue(event.value.id);
    })
  }
}
