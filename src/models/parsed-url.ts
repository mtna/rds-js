export class ParsedUrl {
  /**
   * @param source the original url that was parsed
   * @param protocol the protocol declares how your web browser should communicate with a web server when sending or fetching a web page or document.
   * @param host the subdomain (if it exists) and domain
   * @param port the optional port number
   * @param path the path typically refers to a file or directory on the web server
   * @param segments the path divided into each segment
   * @param query is represented by a question mark followed by one or more parameters.
   * @param params are snippets of information found in the query string of a URL. An object keyed on the parameter name and the value is the paramter value
   * @param hash or a fragment, is an internal page reference, sometimes called a named anchor
   */
  constructor(
    public source: string,
    public protocol: string,
    public host: string,
    public port: string = '',
    public path: string,
    public segments: string[] = [],
    public query: string = '',
    public params: { [name: string]: string } = {},
    public hash: string = ''
  ) {}
}
