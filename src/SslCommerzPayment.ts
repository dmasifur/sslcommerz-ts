import { URLSearchParams } from 'url';
import { httpCall } from './api/fetch';
import type {
  PaymentData,
  ValidationResponse,
  RefundInitiateData,
  RefundQueryData,
  TransactionQueryBySessionIdData,
  TransactionQueryByTransactionIdData,
  InitResponse,
  RefundResponse
} from './types';

export class SslCommerzPayment {
  private readonly baseURL: string;
  private readonly store_id: string;
  private readonly store_passwd: string;

  constructor(store_id: string, store_passwd: string, is_live = false) {
    this.baseURL = `https://${is_live ? 'securepay' : 'sandbox'}.sslcommerz.com`;
    this.store_id = store_id;
    this.store_passwd = store_passwd;
  }


  public async init(data: PaymentData): Promise<InitResponse> {

    const postData: PaymentData & { store_id: string; store_passwd: string } = {
      ...data,
      store_id: this.store_id,
      store_passwd: this.store_passwd,
    };

    const formData = new URLSearchParams()
    for (const key in postData) {
      if (Object.prototype.hasOwnProperty.call(postData, key)) {

        const value = postData[key as keyof typeof postData];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    }
    
    const url = `${this.baseURL}/gwprocess/v4/api.php`;

    return httpCall({ url, method: 'POST', data: formData });
  }


  public async validate(val_id: string): Promise<ValidationResponse> {
    const params = new URLSearchParams({
      val_id,
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      v: '1',
      format: 'json',
    });

    const url = `${this.baseURL}/validator/api/validationserverAPI.php?${params.toString()}`;
    return httpCall<ValidationResponse>({ url, method: 'GET' });
  }


  public async initiateRefund(data: RefundInitiateData): Promise<RefundResponse> {
    const params = new URLSearchParams({
      refund_amount: String(data.refund_amount),
      refund_remarks: data.refund_remarks,
      bank_tran_id: data.bank_tran_id,
      refe_id: data.refe_id || '',
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      v: '1',
      format: 'json',
    });

    const url = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?${params.toString()}`;
    return httpCall({ url, method: 'GET' });
  }


  public async refundQuery(data: RefundQueryData): Promise<any> {
    const params = new URLSearchParams({
      refund_ref_id: data.refund_ref_id,
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      v: '1',
      format: 'json',
    });

    const url = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?${params.toString()}`;
    return httpCall({ url, method: 'GET' });
  }

  public async transactionQueryBySessionId(data: TransactionQueryBySessionIdData): Promise<any> {
    const params = new URLSearchParams({
      sessionkey: data.sessionkey,
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      v: '1',
      format: 'json',
    });

    const url = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?${params.toString()}`;
    return httpCall({ url, method: 'GET' });
  }


  public async transactionQueryByTransactionId(data: TransactionQueryByTransactionIdData): Promise<any> {
    const params = new URLSearchParams({
      tran_id: data.tran_id,
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      v: '1',
      format: 'json',
    });

    const url = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?${params.toString()}`;
    return httpCall({ url, method: 'GET' });
  }
}