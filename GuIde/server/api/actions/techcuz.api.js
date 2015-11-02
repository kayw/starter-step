import { insertGudmark, getGudmarks, delGudmark } from './gudmarks.table';
export function post(params, body) {
  return insertGudmark('techcuz', params, body);
}

export function get(query) {
  return getGudmarks('techcuz', query);
}

export function del(params, body) {
  return delGudmark('techcuz', body);
}
