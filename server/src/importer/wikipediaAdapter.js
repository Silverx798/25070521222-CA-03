/**
 * Mythos Atlas - Wikipedia MediaWiki Action API Adapter
 * 
 * Fetches canonical article data, introductory extracts, and lead image references
 * using the official MediaWiki API (https://www.mediawiki.org/wiki/API:Query).
 */

const USER_AGENT = 'MythosAtlasFolkloreImporter/1.0 (archive@mythosatlas.org; Node.js/Express)';

/**
 * Fetch article metadata, intro extract, canonical page URL, and lead image from Wikipedia.
 * @param {string} title 
 * @returns {Promise<{ pageId: string, title: string, canonicalUrl: string, extract: string, leadImage: { url: string, thumbnailUrl: string, fileTitle: string } | null }>}
 */
async function fetchWikipediaArticle(title) {
  const endpoint = new URL('https://en.wikipedia.org/w/api.php');
  endpoint.searchParams.set('action', 'query');
  endpoint.searchParams.set('prop', 'extracts|pageimages|info');
  endpoint.searchParams.set('exintro', 'true');
  endpoint.searchParams.set('explaintext', 'true');
  endpoint.searchParams.set('inprop', 'url');
  endpoint.searchParams.set('piprop', 'original|thumbnail|name');
  endpoint.searchParams.set('pithumbsize', '800');
  endpoint.searchParams.set('redirects', '1');
  endpoint.searchParams.set('titles', title);
  endpoint.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!res.ok) {
      throw new Error(`Wikipedia API responded with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const pages = data.query?.pages;

    if (!pages) {
      return null;
    }

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || page.missing !== undefined) {
      return null;
    }

    let leadImage = null;
    if (page.original || page.thumbnail) {
      leadImage = {
        url: page.original?.source || page.thumbnail?.source,
        thumbnailUrl: page.thumbnail?.source || page.original?.source,
        fileTitle: page.pageimage ? `File:${page.pageimage}` : ''
      };
    }

    return {
      pageId: String(page.pageid),
      title: page.title,
      canonicalUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
      extract: page.extract || '',
      leadImage
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  fetchWikipediaArticle,
  USER_AGENT
};
