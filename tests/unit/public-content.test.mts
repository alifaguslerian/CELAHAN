import assert from 'node:assert/strict';
import { test } from 'node:test';

const content = await import('../../src/content/findings.ts').catch(() => null);
const catalog = await import('../../src/content/packages.ts').catch(() => null);

test('public sample preserves the five canonical source findings and their order', () => {
  assert.ok(content, 'canonical content must exist');
  assert.deepEqual(content.findings.map((finding) => [finding.id, finding.title.id, finding.category, finding.location.id, finding.score, finding.severity, finding.status.id]), [
    ['F-01', 'Masukan kolom pencarian tidak disaring', 'A03 Injection', '/cari (parameter q)', 8.1, 'High', 'Belum diperbaiki'],
    ['F-02', 'Halaman admin bisa dibuka tanpa login', 'A01 Broken Access Control', '/admin', 7.5, 'High', 'Belum diperbaiki'],
    ['F-03', 'Pustaka lama masih dipakai', 'A06 Vulnerable and Outdated Components', '/static/lib.js', 5.3, 'Medium', 'Sudah diperbaiki'],
    ['F-04', 'Header keamanan tidak lengkap', 'A05 Security Misconfiguration', 'Seluruh halaman', 4.3, 'Medium', 'Belum diperbaiki'],
    ['F-05', 'Pesan error menampilkan detail teknis', 'A05 Security Misconfiguration', '/api/error', 3.7, 'Low', 'Sudah diperbaiki'],
  ]);
});

test('package catalog contains qualitative bilingual scope without deferred numerical terms', () => {
  assert.ok(catalog, 'public package catalog must exist');
  assert.deepEqual(catalog.packages.map((item) => item.id), ['scout', 'warden', 'nexus', 'atlas']);
  for (const item of catalog.packages) {
    for (const locale of ['id', 'en'] as const) {
      assert.ok(item.fit[locale] && item.description[locale] && item.boundary[locale]);
    }
    assert.equal(Object.keys(item).some((key) => /price|cap|effort|cycle/i.test(key)), false);
    assert.equal(/\d/.test(JSON.stringify(item)), false);
  }
});
