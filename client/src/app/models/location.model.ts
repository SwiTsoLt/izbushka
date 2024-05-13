export class LocationArea {
  constructor(
    public _id: string,
    public name: string,
    public children: string[],
  ) {}
}

export class LocationRegion {
  constructor(public _id: string, public name: string, public parent: string) {}
}

export class Location {
  constructor(public area: LocationArea, public region: LocationRegion) {}
}

export class ShortLocation {
  constructor(public area?: string, public region?: string) {}
}
