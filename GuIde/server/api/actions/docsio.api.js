import { insertGudmark, getGudmarks, delGudmark } from './gudmarks.table';
export function post(params, body) {
  return insertGudmark('docsio', params, body);
}

export function get(query) {
  return getGudmarks('docsio', query);
}

export function del(params, body) {
  return delGudmark('docsio', body);
}
