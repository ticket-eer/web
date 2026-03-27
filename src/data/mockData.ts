export interface City {
  id: string;
  name: string;
}

export interface Train {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  date: string;
}

export interface Ticket {
  id: string;
  passengerName: string;
  email: string;
  train: Train;
  status: 'valid' | 'used' | 'invalid';
  purchaseDate: string;
}

export const cities: City[] = [
  { id: 'LON', name: 'London' },
  { id: 'PAR', name: 'Paris' },
  { id: 'BER', name: 'Berlin' },
  { id: 'ROM', name: 'Rome' },
  { id: 'MAD', name: 'Madrid' },
  { id: 'AMS', name: 'Amsterdam' },
  { id: 'VIE', name: 'Vienna' },
  { id: 'PRA', name: 'Prague' },
  { id: 'BRU', name: 'Brussels' },
  { id: 'ZUR', name: 'Zurich' },
  { id: 'MUN', name: 'Munich' },
  { id: 'BAR', name: 'Barcelona' },
];

export const generateTrains = (from: string, to: string, date: string): Train[] => {
  if (!from || !to || from === to) return [];
  
  const baseTrains = [
    {
      id: 'TR-101',
      departureTime: '08:00',
      arrivalTime: '11:30',
      price: 45.00,
    },
    {
      id: 'TR-205',
      departureTime: '10:15',
      arrivalTime: '13:45',
      price: 52.00,
    },
    {
      id: 'TR-312',
      departureTime: '14:00',
      arrivalTime: '17:30',
      price: 45.00,
    },
    {
      id: 'TR-421',
      departureTime: '16:45',
      arrivalTime: '20:15',
      price: 58.00,
    },
    {
      id: 'TR-508',
      departureTime: '19:30',
      arrivalTime: '23:00',
      price: 48.00,
    },
  ];

  return baseTrains.map(train => ({
    ...train,
    departureCity: from,
    arrivalCity: to,
    date: date,
  }));
};

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-2026-001234',
    passengerName: 'John Smith',
    email: 'john.smith@email.com',
    train: {
      id: 'TR-101',
      departureCity: 'London',
      arrivalCity: 'Paris',
      departureTime: '08:00',
      arrivalTime: '11:30',
      price: 45.00,
      date: '2026-01-25',
    },
    status: 'valid',
    purchaseDate: '2026-01-19',
  },
  {
    id: 'TKT-2026-001198',
    passengerName: 'John Smith',
    email: 'john.smith@email.com',
    train: {
      id: 'TR-312',
      departureCity: 'Berlin',
      arrivalCity: 'Munich',
      departureTime: '14:00',
      arrivalTime: '17:30',
      price: 45.00,
      date: '2026-01-18',
    },
    status: 'used',
    purchaseDate: '2026-01-15',
  },
  {
    id: 'TKT-2026-001145',
    passengerName: 'John Smith',
    email: 'john.smith@email.com',
    train: {
      id: 'TR-205',
      departureCity: 'Amsterdam',
      arrivalCity: 'Brussels',
      departureTime: '10:15',
      arrivalTime: '13:45',
      price: 52.00,
      date: '2026-01-12',
    },
    status: 'used',
    purchaseDate: '2026-01-10',
  },
];
