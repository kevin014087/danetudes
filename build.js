#!/usr/bin/env node
/**
 * Build Script for DANETUDES
 * Minify CSS/JS and optimize assets
 * Usage: npm run build
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const CSS_DIR = path.join(ASSETS_DIR, 'css');
const JS_DIR = path.join(ASSETS_DIR, 'js');

// Simple CSS minifier
function minifyCSS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around brackets
    .trim();
}

// Simple JS minifier
function minifyJS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,()])\s*/g, '$1') // Remove space around brackets
    .trim();
}

// Concatenate CSS files
function bundleCSS() {
  console.log('📦 Bundling CSS...');
  const files = [
    'style.css',
    'animations.css',
    'testimonials.css',
    'planning.css',
    'parcours.css',
    'resources.css'
  ];

  let content = '';
  files.forEach(file => {
    const filePath = path.join(CSS_DIR, file);
    if (fs.existsSync(filePath)) {
      content += fs.readFileSync(filePath, 'utf-8') + '\n';
    }
  });

  const minified = minifyCSS(content);
  const outputPath = path.join(CSS_DIR, 'bundle.min.css');
  fs.writeFileSync(outputPath, minified);
  
  const originalSize = content.length;
  const minifiedSize = minified.length;
  const saved = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
  
  console.log(`✅ CSS Bundle: ${originalSize} → ${minifiedSize} bytes (saved ${saved}%)`);
}

// Concatenate JS files
function bundleJS() {
  console.log('📦 Bundling JavaScript...');
  const files = [
    'i18n.js',
    'main.js',
    'contact.js',
    'planning.js',
    'quiz.js',
    'clapay-once.js'
  ];

  let content = '';
  files.forEach(file => {
    const filePath = path.join(JS_DIR, file);
    if (fs.existsSync(filePath)) {
      content += fs.readFileSync(filePath, 'utf-8') + '\n';
    }
  });

  const minified = minifyJS(content);
  const outputPath = path.join(JS_DIR, 'bundle.min.js');
  fs.writeFileSync(outputPath, minified);
  
  const originalSize = content.length;
  const minifiedSize = minified.length;
  const saved = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
  
  console.log(`✅ JS Bundle: ${originalSize} → ${minifiedSize} bytes (saved ${saved}%)`);
}

// Main
console.log('🚀 Building DANETUDES assets...\n');
try {
  bundleCSS();
  bundleJS();
  console.log('\n✨ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
