export interface PaymentData {
  total_amount: number,
  currency: string,
  tran_id: string,
  success_url: string,
  fail_url: string,
  cancel_url: string,
  ipn_url?: string,
  shipping_method: string,
  product_name: string,
  product_category: string,
  product_profile: string,
  cus_name: string,
  cus_email: string,
  cus_add1: string,
  cus_add2?: string,
  cus_city: string,
  cus_state?: string,
  cus_postcode: string,
  cus_country: string,
  cus_phone: string,
  cus_fax?: string,
  ship_name: string,
  ship_add1: string,
  ship_add2?: string,
  ship_city: string,
  ship_state?: string,
  ship_postcode: string,
  ship_country: string,
  num_of_item: number
}




export interface RefundInitiateData {
  refund_amount: number;
  refund_remarks: string;
  bank_tran_id: string;
  refe_id?: string;
}


export interface RefundQueryData {
  refund_ref_id: string;
}

export interface TransactionQueryBySessionIdData {
  sessionkey: string;
}

export interface TransactionQueryByTransactionIdData {
  tran_id: string;
}

export interface TransactionDetails {
  status: 'VALID' | 'VALIDATED' | 'INVALID' | 'INVALID_TRANSACTION' | 'PENDING' | 'CANCELLED' | 'UNATHORIZED' | 'EXPIRED';
  tran_date: string;
  tran_id: string;
  val_id?: string;
  amount: string;
  store_amount: string;
  currency: string;
  bank_tran_id?: string;
  card_type: string;
  card_no?: string;
  card_issuer?: string;
  card_brand: string;
  risk_level: '0' | '1';
  risk_title: 'Safe' | 'Risk';
  error?: string;
  currency_type?: string;
  currency_amount?: string;
  currency_rate?: string;
  base_fair?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  verify_sign?: string;
  verify_key?: string;
}

export type ValidationResponse = TransactionDetails;

export interface InitResponse {
  status: 'SUCCESS' | 'FAILED';
  sessionkey?: string;
  GatewayPageURL?: string;
  failedreason?: string;
  directPaymentURL?: string;
}


export interface RefundResponse {
  status: 'success' | 'failed' | 'error';
  API_Response?: any;
  refund_ref_id?: string;
  error?: string;
}

export interface TransactionQueryResponse {
  no_of_trans_found: number;
  element: TransactionDetails[];
  status?: 'SUCCESS' | 'FAILED';
}