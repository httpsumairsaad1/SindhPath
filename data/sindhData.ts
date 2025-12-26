
import { City, Connection } from '../types';

export const CITIES: City[] = [
  { id: 'KHI', name: 'Karachi', x: 15, y: 85, description: 'The financial hub and largest city of Pakistan.' },
  { id: 'HYD', name: 'Hyderabad', x: 28, y: 72, description: 'Known for its bangles, rich culture, and history.' },
  { id: 'TTA', name: 'Thatta', x: 22, y: 88, description: 'Home to the Makli Necropolis, a UNESCO World Heritage site.' },
  { id: 'BDN', name: 'Badin', x: 42, y: 85, description: 'A fertile agricultural region famous for sugar production.' },
  { id: 'MPK', name: 'Mirpur Khas', x: 45, y: 70, description: 'The "City of Mangoes" in Sindh.' },
  { id: 'NWS', name: 'Nawabshah', x: 40, y: 55, description: 'The central crossroads of Sindh, officially Shaheed Benazirabad.' },
  { id: 'JMS', name: 'Jamshoro', x: 26, y: 68, description: 'The "Education City" of Sindh.' },
  { id: 'SKZ', name: 'Sukkur', x: 65, y: 25, description: 'Historic city famous for the Lansdowne Bridge and Sukkur Barrage.' },
  { id: 'LKN', name: 'Larkana', x: 48, y: 32, description: 'Gateway to Mohenjo-daro, the ancient Indus Valley site.' },
  { id: 'KHP', name: 'Khairpur', x: 62, y: 35, description: 'Known for its dates and the historic Faiz Mahal.' },
  { id: 'JCB', name: 'Jacobabad', x: 55, y: 15, description: 'One of the hottest cities in Pakistan during summer.' },
  { id: 'DDU', name: 'Dadu', x: 32, y: 48, description: 'Located near the scenic Gorakh Hill station.' },
  { id: 'THP', name: 'Tharparkar', x: 80, y: 78, description: 'The desert region of Sindh with unique culture.' },
  { id: 'GHT', name: 'Ghotki', x: 75, y: 20, description: 'Important industrial and agricultural center near Punjab border.' }
];

export const CONNECTIONS: Connection[] = [
  { from: 'KHI', to: 'TTA', distance: 100 },
  { from: 'KHI', to: 'HYD', distance: 160 },
  { from: 'KHI', to: 'JMS', distance: 155 },
  { from: 'TTA', to: 'BDN', distance: 110 },
  { from: 'BDN', to: 'MPK', distance: 125 },
  { from: 'HYD', to: 'MPK', distance: 75 },
  { from: 'HYD', to: 'JMS', distance: 15 },
  { from: 'HYD', to: 'NWS', distance: 120 },
  { from: 'JMS', to: 'DDU', distance: 140 },
  { from: 'DDU', to: 'LKN', distance: 105 },
  { from: 'LKN', to: 'SKZ', distance: 60 },
  { from: 'LKN', to: 'JCB', distance: 90 },
  { from: 'SKZ', to: 'KHP', distance: 25 },
  { from: 'SKZ', to: 'GHT', distance: 70 },
  { from: 'SKZ', to: 'NWS', distance: 185 },
  { from: 'NWS', to: 'KHP', distance: 160 },
  { from: 'NWS', to: 'MPK', distance: 115 },
  { from: 'MPK', to: 'THP', distance: 150 },
  { from: 'SKZ', to: 'JCB', distance: 80 },
  { from: 'GHT', to: 'KHP', distance: 95 }
];
