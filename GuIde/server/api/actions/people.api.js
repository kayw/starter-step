import { insertGudmark, getGudmarks, delGudmark } from './gudmarks.table';
export function post(params, body) {
  return insertGudmark('people', params, body);
}

export function get(query) {
  return getGudmarks('people', query);
}

export function del(params, body) {
  return delGudmark('people', body);
}
