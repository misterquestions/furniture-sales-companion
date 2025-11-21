import type { InventoryInfo } from "./providers";
import type { Provider } from "./providers";

export type CatalogProduct = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  subtype: string;
  description: string;
  priceList: number;
  isExhibition: boolean;
  fabrics: string[];
  imageUrl: string;
  inventory?: InventoryInfo;
  tags?: string[];
  providerId?: string;
  provider?: Provider;
};
