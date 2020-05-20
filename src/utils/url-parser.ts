import { ParsedUrl } from '../models/parsed-url';

/**
 * This function creates a new anchor element and uses location
 * properties (inherent) to get the desired URL data. Some String
 * operations are used (to normalize results across browsers).
 *
 * @remarks
 * References JS implementation from <https://j11y.io/javascript/parsing-urls-with-the-dom/>
 *
 * @example
 * ```ts
 * const myURL = _parseUrl('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
 * myURL.source;   // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
 * myURL.protocol; // = 'http'
 * myURL.host;     // = 'abc.com'
 * myURL.port;     // = '8080'
 * myURL.path;     // = '/dir/index.html'
 * myURL.segments; // = Array = ['dir', 'index.html']
 * myURL.query;    // = '?id=255&m=hello'
 * myURL.params;   // = Object = { id: 255, m: hello }
 * myURL.hash;     // = 'top'
 * ```
 *
 * @param url the url to parse
 * @returns the parsed url
 */
export function _parseUrl(url: string): ParsedUrl {
  const a = document.createElement('a');
  a.href = url;

  const parsedUrl = new ParsedUrl(
    url,
    a.protocol.replace(':', ''),
    a.hostname,
    a.port,
    a.pathname.replace(/^([^/])/, '/$1'),
    a.pathname.replace(/^\//, '').split('/'),
    a.search,
    (function() {
      const params: { [name: string]: string } = {};
      const seg = a.search.replace(/^\?/, '').split('&');

      for (let i = 0; i < seg.length; i++) {
        if (!seg[i]) {
          continue;
        }
        const s = seg[i].split('=');
        params[s[0]] = s[1];
      }
      return params;
    })(),
    a.hash.replace('#', '')
  );

  // Clean up and remove anchor element
  a.remove();
  return parsedUrl;
}
