function encodeFormValues(values) {
    return {
        sportsFacility: values.sportsFacility.map((item) => item.id),
        departmentalAffiliation: values.departmentalAffiliation.map((item) => item.id),
        sportsZonesList: values.sportsZonesList.map((item) => item.id),
        sportsZonesTypes: values.sportsZonesTypes.map((item) => item.id),
        sportsServices: values.sportsServices.map((item) => item.id),
        availability: Object.keys(values.availability).reduce((acc, key) => {
            if (values.availability[key]) {
                acc.push(key);
            }

            return acc;
        }, []),
    };
}

export default {
    encodeFormValues,
};
