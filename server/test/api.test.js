const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Helper to make HTTP requests against local running server
const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: body ? JSON.parse(body) : null
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              raw: body
            });
          }
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

test('Mythos Atlas End-to-End API Test Suite', async (t) => {
  await t.test('1. Health check returns status ok', async () => {
    const res = await request('/api/health');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.status, 'ok');
    assert.equal(res.data.service, 'Mythos Atlas API');
  });

  await t.test('2. Stories listing endpoint returns published folklore', async () => {
    const res = await request('/api/stories');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length > 0);
    assert.ok(res.data.pagination.total > 0);
  });

  await t.test('3. Featured stories endpoint returns flagship entries', async () => {
    const res = await request('/api/stories/featured');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.data.length >= 4);

    const wendigo = res.data.data.find((s) => s.slug === 'the-wendigo');
    assert.ok(wendigo, 'The Wendigo should be featured');
    assert.equal(wendigo.visualEffect, 'wendigo-parallax');
  });

  await t.test('4. Story detail by slug returns full lore and related stories', async () => {
    const res = await request('/api/stories/the-wendigo');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.title, 'The Wendigo');
    assert.ok(res.data.data.body.includes('Algonquian'));
    assert.ok(Array.isArray(res.data.related));
  });

  await t.test('5. Map endpoint returns GeoJSON coordinates', async () => {
    const res = await request('/api/stories/map');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.count > 0);

    const first = res.data.data[0];
    assert.ok(first.location && first.location.coordinates);
    assert.equal(first.location.coordinates.length, 2);
  });

  await t.test('6. Regions aggregation returns continents and nation counts', async () => {
    const res = await request('/api/regions');
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.data.data.length > 0);

    const na = res.data.data.find((r) => r.continent === 'North America');
    assert.ok(na, 'North America continent should exist');
  });

  let token = null;

  await t.test('7. Authentication: Login with demo admin succeeds', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@mythosatlas.org',
        password: 'AtlasAdmin2026!'
      }
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.user.role, 'admin');
    assert.ok(res.data.token);
    token = res.data.token;
  });

  await t.test('8. Admin endpoint: Access pending moderation submissions', async () => {
    const res = await request('/api/admin/submissions?status=pending', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
  });

  await t.test('9. Community submission workflow: Inscribes new story with pending status', async () => {
    const uniqueTitle = `Automated Cryptid Test ${Date.now()}`;
    const res = await request('/api/submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        title: uniqueTitle,
        summary: 'A test cryptid sighting in the northern woods.',
        body: 'Full manuscript describing the anomalous creature.',
        category: 'cryptids',
        continent: 'North America',
        country: 'United States',
        region: 'Vermont',
        coordinates: [-72.5778, 44.5588],
        locationIsApproximate: true,
        tags: ['test', 'cryptid']
      }
    });

    assert.equal(res.statusCode, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.status, 'pending');
    assert.equal(res.data.data.title, uniqueTitle);
  });
});
