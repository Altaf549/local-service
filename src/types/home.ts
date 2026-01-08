export interface Banner {
  id: number;
  title: string;
  image: string;
  status: string;
}

export interface ServiceCategory {
  id: number;
  category_name: string;
  image: string;
  status: string;
  services_count: number;
}

export interface Service {
  id: number;
  service_name: string;
  category_name: string;
  price: string;
  image: string;
}

export interface Serviceman {
  id: number;
  name: string;
  profile_photo: string;
}

export interface PujaType {
  id: number;
  type_name: string;
  image: string;
  status: string;
  pujas_count: number;
}

export interface Puja {
  id: number;
  puja_name: string;
  puja_type_name: string;
  price: string;
  image: string;
}

export interface Brahman {
  id: number;
  name: string;
  profile_photo: string;
}

export interface HomeData {
  banners: Banner[];
  service_categories: ServiceCategory[];
  services: Service[];
  servicemen: Serviceman[];
  puja_types: PujaType[];
  pujas: Puja[];
  brahmans: Brahman[];
}

export interface HomeApiResponse {
  success: boolean;
  data: HomeData;
}

