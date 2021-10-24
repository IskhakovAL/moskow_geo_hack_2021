import { createContext } from 'react';
import { IDict, MarkerType, TCircle } from '../services/MapService';

export const DictContext = createContext({} as IDict);
export const MarkersContext = createContext([] as MarkerType[]);
export const CirclesContext = createContext([] as TCircle[]);
