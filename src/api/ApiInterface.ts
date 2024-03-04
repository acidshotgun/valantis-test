export interface ApiInterface {
  get_ids: {
    params: [
      data?: {
        offset: number;
        limit: number;
      }
    ];
    result: string[];
  };

  get_items: {
    params: [
      data: {
        ids: string[];
      }
    ];
    result: {
      id: string;
      brand: string | null;
      price: number;
      product: string;
    }[];
  };

  get_fields: {
    params: [
      data?: {
        field?: string;
        offset?: number;
        limit?: number;
      }
    ];
    result: any[];
  };

  filter: {
    params: [
      data: {
        [key: string]: any;
      }
    ];
    result: string[];
  };
}
