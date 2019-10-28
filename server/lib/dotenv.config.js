import dotenv from 'dotenv';

dotenv.config(); // Load the dotenv configurations.

// Add a custom NODE_ENV environment variable based on what's passed through the CLI.
if (process.argv.slice(2).includes('node_env=production')) {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = 'development';
}
