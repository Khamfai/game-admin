import express from 'express';
import serveStatic from 'serve-static';
import history from 'connect-history-api-fallback';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(serveStatic(path.join(__dirname, 'dist/spa')));
app.use(history());
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
