#!/usr/bin/env node

const https = require('https');

const SITE_NAME = 'prompt-goat';
const ENV_VARS = {
  'DATABASE_URL': 'postgresql://neondb_owner:npg_9fgFzQpyG8As@ep-still-moon-a8h5vsmq-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  'NEXTAUTH_SECRET': '5ooRMkcwLRSWXJo35A8IJgvQpb9O7ggqKzK6Im6HrJU=',
  'NEXTAUTH_URL': 'https://prompt-goat.netlify.app'
};

console.log('🔧 Setting Netlify environment variables...\n');
console.log('Please go to: https://app.netlify.com/sites/prompt-goat/settings/env');
console.log('\nAdd these 3 variables:\n');

Object.entries(ENV_VARS).forEach(([key, value]) => {
  console.log(`Key: ${key}`);
  console.log(`Value: ${value}`);
  console.log('---\n');
});

console.log('\nAfter adding variables:');
console.log('1. Click Save');
console.log('2. Go to: https://app.netlify.com/sites/prompt-goat/deploys');
console.log('3. Click "Trigger deploy" → "Deploy site"');
console.log('\n✨ Your site will be live at: https://prompt-goat.netlify.app\n');

// Open the env vars page
const { exec } = require('child_process');
exec('open "https://app.netlify.com/sites/prompt-goat/settings/env"');
