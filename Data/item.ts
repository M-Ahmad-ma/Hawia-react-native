type Hawia = {
  size: string;
  price: string;
};

export type Company = {
  id: number;
  image: string;
  title: string;
  latitude: number;
  longitude: number;
  location: string;
  hawias: Hawia[];
};

export const Items: Company[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1760570317577-fa68f4738373?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500',
    title: 'Toyota Camry 2024',
    location: 'الرياض، السعودية',
    latitude: 24.7136,
    longitude: 46.6753,
    hawias: [
      { size: 'يوميًا', price: '180 ر.س' },
      { size: 'أسبوعيًا', price: '1,100 ر.س' },
      { size: 'شهريًا', price: '4,000 ر.س' },
    ],
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1760470489946-2cdc2f8baca2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500',
    title: 'Nissan Patrol',
    location: 'جدة، السعودية',
    latitude: 21.4858,
    longitude: 39.1925,
    hawias: [
      { size: 'يوميًا', price: '250 ر.س' },
      { size: 'أسبوعيًا', price: '1,500 ر.س' },
      { size: 'شهريًا', price: '5,500 ر.س' },
    ],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
    title: 'Ford Transit Van',
    location: 'دبي، الإمارات',
    latitude: 25.2048,
    longitude: 55.2708,
    hawias: [
      { size: 'يوميًا', price: '220 د.إ' },
      { size: 'أسبوعيًا', price: '1,350 د.إ' },
      { size: 'شهريًا', price: '5,000 د.إ' },
    ],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    title: 'رافعة شوكية كهربائية',
    location: 'الدوحة، قطر',
    latitude: 25.276987,
    longitude: 51.520008,
    hawias: [
      { size: 'نصف يوم', price: '300 ر.ق' },
      { size: 'يوميًا', price: '550 ر.ق' },
      { size: 'أسبوعيًا', price: '3,000 ر.ق' },
    ],
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023',
    title: 'مخزن صناعي صغير',
    location: 'أبو ظبي، الإمارات',
    latitude: 24.4539,
    longitude: 54.3773,
    hawias: [
      { size: 'شهريًا', price: '8,000 د.إ' },
      { size: 'سنويًا', price: '90,000 د.إ' },
    ],
  },
];
