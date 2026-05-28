#!/usr/bin/env node
/**
 * Validation Script for DANETUDES
 * Tests core functionality and security
 */

const http = require('http');
const https = require('https');

const TESTS = [];

function test(name, fn) {
  TESTS.push({ name, fn });
}

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test: Valid form submission
test('contact.php: Valid submission', async () => {
  const payload = {
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+225 01 23 45 67',
    subject: 'Test request',
    message: 'Bonjour, ceci est un test. Comment pouvez-vous m\'aider?'
  };

  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);

  const success = res.status === 200 || res.status === 503;
  console.log(`  ${success ? '✅' : '❌'} Status: ${res.status}`);
  return success;
});

// Test: Invalid email
test('contact.php: Invalid email', async () => {
  const payload = {
    name: 'Test',
    email: 'invalid-email',
    message: 'Test message'
  };

  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);

  const success = res.status === 422;
  console.log(`  ${success ? '✅' : '❌'} Status: ${res.status} (expected 422)`);
  return success;
});

// Test: Missing required field
test('contact.php: Missing message', async () => {
  const payload = {
    name: 'Test',
    email: 'test@example.com'
  };

  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);

  const success = res.status === 422;
  console.log(`  ${success ? '✅' : '❌'} Status: ${res.status} (expected 422)`);
  return success;
});

// Test: GET method not allowed
test('contact.php: GET method not allowed', async () => {
  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'GET'
  });

  const success = res.status === 405;
  console.log(`  ${success ? '✅' : '❌'} Status: ${res.status} (expected 405)`);
  return success;
});

// Test: Invalid JSON
test('contact.php: Invalid JSON', async () => {
  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, undefined);

  // Send raw invalid JSON
  return new Promise((resolve) => {
    const protocol = http;
    const req = protocol.request({
      hostname: 'localhost',
      path: '/contact.php',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      resolve(res.statusCode === 400);
      console.log(`  ${res.statusCode === 400 ? '✅' : '❌'} Status: ${res.statusCode} (expected 400)`);
    });
    req.write('invalid json {');
    req.end();
  });
});

// Test: Security headers
test('Security: Headers present', async () => {
  const res = await request({
    hostname: 'localhost',
    path: '/contact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const headers = res.headers;
  const checks = [
    ['X-Content-Type-Options', headers['x-content-type-options'] === 'nosniff'],
    ['X-Frame-Options', headers['x-frame-options'] === 'deny'],
    ['X-XSS-Protection', headers['x-xss-protection']?.includes('1')],
    ['Content-Type', headers['content-type']?.includes('application/json')]
  ];

  let allGood = true;
  checks.forEach(([name, ok]) => {
    const status = ok ? '✅' : '❌';
    console.log(`  ${status} ${name}`);
    if (!ok) allGood = false;
  });

  return allGood;
});

// Test: Files exist
test('Files: Check required files', () => {
  const fs = require('fs');
  const files = [
    './contact.php',
    './config.php',
    './assets/js/contact.js',
    './assets/js/i18n.js',
    './README.md',
    './.env.example',
    './sitemap.xml'
  ];

  let allGood = true;
  files.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allGood = false;
  });

  return allGood;
});

// Run tests
async function runTests() {
  console.log('🧪 Running DANETUDES validation tests...\n');

  let passed = 0;
  let failed = 0;

  for (const { name, fn } of TESTS) {
    console.log(`\n${name}`);
    try {
      const result = await fn();
      if (result) passed++;
      else failed++;
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  process.exit(failed > 0 ? 1 : 0);
}

// Start with a small delay to ensure server is ready
setTimeout(runTests, 500);
