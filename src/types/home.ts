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
  services_count?: number;
  services?: Service[];
}

export interface Service {
  id: number;
  service_name: string;
  category_name?: string;
  price: string;
  description?: string;
  image: string;
  status?: string;
}

export interface Serviceman {
  id: number;
  name: string;
  phone: string;
  email: string;
  mobile_number: string;
  category: {
    id: number;
    category_name: string;
  };
  experience: number;
  profile_photo: string;
  availability_status: string;
}

export interface PujaType {
  id: number;
  type_name: string;
  image: string;
  status: string;
  pujas_count?: number;
  pujas?: Puja[];
}

export interface Puja {
  id: number;
  puja_name: string;
  puja_type_id: number;
  puja_type_name: string;
  duration: string;
  price: string;
  description: string;
  image: string;
  material_file: string;
  status: string;
}

export interface Brahman {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  specialization: string;
  languages: string;
  experience: number;
  charges: string;
  profile_photo: string;
  availability_status: string;
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

