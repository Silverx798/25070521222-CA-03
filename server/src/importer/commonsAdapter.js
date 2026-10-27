/**
 * Mythos Atlas - Wikimedia Commons API Adapter
 * 
 * Fetches machine-readable licensing, author credits, and descriptions
 * for Wikimedia Commons media files (https://commons.wikimedia.org/wiki/Commons:Machine-readable_data/en).
 */

const { USER_AGENT } = require('./wikipediaAdapter');

/**
 * Clean HTML markup out of Wikimedia metadata fields.
 */
function stripHtml(htmlStr) {
  if (!htmlStr) return '';
  return htmlStr.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Classify the visual media type based on description and title.
 */
function classifyMediaType(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('photo') || text.includes('photograph') || text.includes('camera') || text.includes('exterior') || text.includes('view of')) {
    return 'photograph';
  }
  if (text.includes('archival') || text.includes('engraving') || text.includes('woodcut') || text.includes('lithograph') || text.includes('manuscript') || text.includes('painting') || text.includes('historical print')) {
    return 'archival-image';
  }
  if (text.includes('statue') || text.includes('sculpture') || text.includes('monument') || text.includes('memorial')) {
    return 'photograph';
  }
  if (text.includes('artist') || text.includes('impression') || text.includes('drawing') || text.includes('depiction') || text.includes('illustration')) {
    return 'artistic-interpretation';
  }
  return 'illustration';
}

/**
 * Fetch licensing and attribution metadata for a Wikimedia Commons file.
 * @param {string} fileTitle E.g. 'File:Mothman_Artist%27s_Impression.png'
 * @returns {Promise<{ credit: string, license: string, licenseUrl: string, description: string, sourcePageUrl: string, mediaType: string } | null>}
 */
async function fetchCommonsImageMetadata(fileTitle) {
  if (!fileTitle) return null;

  const endpoint = new URL('https://commons.wikimedia.org/w/api.php');
  endpoint.searchParams.set('action', 'query');
  endpoint.searchParams.set('prop', 'imageinfo');
  endpoint.searchParams.set('iiprop', 'url|extmetadata');
  endpoint.searchParams.set('titles', fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`);
  endpoint.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(endpoint.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || page.missing !== undefined || !page.imageinfo || !page.imageinfo[0]) {
      return null;
    }

    const info = page.imageinfo[0];
    const ext = info.extmetadata || {};

    const rawArtist = ext.Artist?.value || ext.Credit?.value || '';
    const credit = stripHtml(rawArtist) || 'Wikimedia Commons Contributor';
    const license = ext.LicenseShortName?.value || 'Creative Commons Attribution-ShareAlike / Public Domain';
    const licenseUrl = ext.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
    const description = stripHtml(ext.ImageDescription?.value || page.title);
    const sourcePageUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
    const mediaType = classifyMediaType(page.title, description);

    return {
      credit,
      license,
      licenseUrl,
      description,
      sourcePageUrl,
      mediaType
    };
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Search Wikimedia Commons for an authentic image if lead image is missing.
 * @param {string} query 
 * @returns {Promise<{ url: string, thumbnailUrl: string, fileTitle: string, credit: string, license: string, licenseUrl: string, sourcePageUrl: string, mediaType: string } | null>}
 */
async function searchCommonsImage(query) {
  const endpoint = new URL('https://commons.wikimedia.org/w/api.php');
  endpoint.searchParams.set('action', 'query');
  endpoint.searchParams.set('generator', 'search');
  endpoint.searchParams.set('gsrsearch', `${query} folklore OR statue OR painting OR photo`);
  endpoint.searchParams.set('gsrnamespace', '6'); // File namespace
  endpoint.searchParams.set('gsrlimit', '3');
  endpoint.searchParams.set('prop', 'imageinfo');
  endpoint.searchParams.set('iiprop', 'url|extmetadata');
  endpoint.searchParams.set('iiurlwidth', '800');
  endpoint.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(endpoint.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!res.ok) return null;

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const pageList = Object.values(pages);
    for (const page of pageList) {
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        const ext = info.extmetadata || {};
        const url = info.url;
        const thumbnailUrl = info.thumburl || url;

        // Skip svg or audio files
        if (url.endsWith('.svg') || url.endsWith('.ogg') || url.endsWith('.mid')) continue;

        const credit = stripHtml(ext.Artist?.value || ext.Credit?.value) || 'Wikimedia Commons Contributor';
        const license = ext.LicenseShortName?.value || 'CC-BY-SA 4.0 / Public Domain';
        const licenseUrl = ext.LicenseUrl?.value || 'https://creativecommons.org/licenses/by-sa/4.0/';
        const description = stripHtml(ext.ImageDescription?.value || page.title);
        const sourcePageUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
        const mediaType = classifyMediaType(page.title, description);

        return {
          url,
          thumbnailUrl,
          fileTitle: page.title,
          credit,
          license,
          licenseUrl,
          sourcePageUrl,
          mediaType
        };
      }
    }
    return null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  fetchCommonsImageMetadata,
  searchCommonsImage,
  stripHtml
};
