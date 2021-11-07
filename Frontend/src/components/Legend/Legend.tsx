import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const Legend = ({ getColor, grades, classname = '' }) => {
    const map = useMap();

    useEffect(() => {
        // @ts-ignore
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', `info legend ${classname}`);
            const labels = [];
            let from;
            let to;

            for (let i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    `<i style="background:${getColor(from + 1)}"></i> ${from}${
                        to ? `&ndash;${to}` : '+'
                    }`,
                );
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(map);

        return () => {
            map.removeControl(legend);
        };
    }, []); // here add map
    return null;
};

export default Legend;
