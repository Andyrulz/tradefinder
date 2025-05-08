/**
 * @vercel/crons 0 */4 * * *
 */
import { POST as refreshHandler } from './refresh/route';

export const runtime = 'edge'; // or 'nodejs' if you need Node features

export default refreshHandler;
