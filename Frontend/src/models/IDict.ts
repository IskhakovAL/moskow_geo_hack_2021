export type DictItem = {
    id: number;
    name: string;
};

export interface IDict {
    sportsFacility: DictItem[];
    departmentalAffiliation: DictItem[];
    sportsZonesList: DictItem[];
    sportsZonesTypes: DictItem[];
    sportsServices: DictItem[];
    availability: DictItem[];
}
