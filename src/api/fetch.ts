import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url'
import FormData from 'form-data';
type HttpBody = FormData | URLSearchParams | undefined

interface HttpCallArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: HttpBody;
}


export async function httpCall<T>({ url, method = 'POST', data }: HttpCallArgs): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {

    },
  };

  if (method !== 'GET' && data) {
    options.body = data;
  }

  const response: Response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}