import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';

const dict = {
    sportsFacility: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
    departmentalAffiliation: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
    sportsZonesList: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
    sportsZonesTypes: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
    sportsServices: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
    availability: [
        { id: 'step', name: 'С шаговой доступностью' },
        { id: 'regional', name: 'С районной доступностью' },
        { id: 'district', name: 'С окружной доступностью' },
        { id: 'city', name: 'Городского значения' },
    ],
};

const sendFilters = {
    sportsFacility: ['step', 'regional', 'city'],
    departmentalAffiliation: ['step', 'regional', 'city'],
    sportsZonesList: ['step', 'regional', 'city'],
    sportsZonesTypes: ['step', 'regional', 'city'],
    sportsServices: ['step', 'regional', 'city'],
    availability: ['step', 'regional', 'city'],
};


ReactDOM.render(<App />, document.getElementById('root'));
