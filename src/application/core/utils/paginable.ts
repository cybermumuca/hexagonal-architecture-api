export interface Paginable<Entity> {
  results: Entity;
  page: number;
  pageSize: number;
  length: number;
  total: number;
}
