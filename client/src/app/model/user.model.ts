export class UserLocation {
    constructor(
        public areaID: string,
        public regionID: string 
    ) {}
}

export class User {
    constructor(
        public id: string,
        public gmail: string,
        public phone: string,
        public first_name: string,
        public last_name: string,
        public avatar: string,
        public posts: string[],
        public location: UserLocation,
        public registration_date: number
    ) {}
}