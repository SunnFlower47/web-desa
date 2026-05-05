// Types untuk aplikasi Desa Cibatu

export interface NewsItem {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  published_at: string;
  slug?: string;
  source?: string;
  category?: string;
  is_external?: boolean;
  link?: string;
  url?: string;
  author?: {
    name: string;
  };
}

export interface TestimonialItem {
  id: number;
  nama: string;
  email?: string;
  telepon?: string;
  rt?: string;
  rw?: string;
  testimoni: string;
  status: string;
  rating?: number;
  kategori?: string;
  is_anonymous: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface StatisticsData {
  total_penduduk: number;
  total_kk: number;
  total_rt: number;
  laki_laki: number;
  perempuan: number;
  usia_produktif: number;
  usia_lansia: number;
  total_mutasi: number;
  total_berita: number;
  total_pengajuan: number;
  pendidikan: {
    tamat_sd: number;
    slta: number;
    tidak_sekolah: number;
    sltp: number;
  };
}

export interface UMKMData {
  id: number;
  nama_usaha: string;
  pemilik: string;
  alamat: string;
  jenis_usaha: string;
  kategori: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface FasilitasData {
  id: number;
  nama_fasilitas: string;
  jenis_fasilitas: string;
  alamat: string;
  status: string;
  deskripsi: string;
  created_at?: string;
  updated_at?: string;
}

export interface DesaInfo {
  desa: {
    nama_desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    alamat_lengkap: string;
    telepon: string;
    email: string;
    website: string;
  };
  kepala_desa: {
    nama: string;
    periode: string;
  };
}

export interface SuratType {
  id: string;
  name: string;
  description?: string;
  required_fields?: string[];
  template?: string;
}

export interface Penduduk {
  id: number;
  nik: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  email?: string;
  telepon?: string;
}

export interface SuratPengajuan {
  id: number;
  jenis_surat: string;
  nik_pengaju: string;
  email?: string;
  tujuan?: string;
  data_tambahan?: any;
  status: string;
  nomor_surat?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  nama: string;
  email: string;
  telepon?: string;
  subjek: string;
  pesan: string;
}

export interface PengaduanForm {
  nama: string;
  email: string;
  telepon?: string;
  jenis_pengaduan: string;
  deskripsi: string;
  lokasi?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
