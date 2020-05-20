/** Typed http reponse */
export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
