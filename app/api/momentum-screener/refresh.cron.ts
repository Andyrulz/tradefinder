// @vercel/crons 0 */4 * * *
import CRON from './refresh/cron';

export const runtime = 'edge';
export default CRON;
