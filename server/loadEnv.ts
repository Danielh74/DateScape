import dotenv from 'dotenv';

// Imported first in index.ts so env vars exist before any other module reads them
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
