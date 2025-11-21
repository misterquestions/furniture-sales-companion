export type Fabric = {
  id: string;
  name: string;
  colorHex: string;
  description?: string;
};

export type InventoryInfo = {
  onHand: number;
  incoming?: number;
  leadTimeWeeks?: number;
  notes?: string;
};

export type Provider = {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  leadTimeWeeks?: number;
  notes?: string;
  rating?: number;
};
