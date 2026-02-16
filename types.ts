
export enum ThemeMode {
  LIQUID_LIGHT = 'liquid-light',
  LIQUID_DARK = 'liquid-dark',
  VIBRANT = 'vibrant',
  MINIMAL = 'minimal'
}

export enum Availability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  PRE_ORDER = 'pre_order'
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  product: string;
  quantity: number;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface Product {
  id: string;
  sku?: string;
  title: string;
  short_description: string;
  long_description: string;
  price: number;
  currency: string;
  png_url: string;
  photos: string[];
  availability: Availability;
  tags: string[];
  recommend?: string[];
}

export interface AppState {
  theme: ThemeMode;
  products: Product[];
  isLoading: boolean;
}
