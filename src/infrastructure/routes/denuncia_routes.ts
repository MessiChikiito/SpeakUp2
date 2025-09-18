import { Router } from 'express';
import { DenunciaController } from '../controller/DenunciaController';
import { requireAuth } from '../web/AuthMiddleware';

// Rate limit básico en memoria (window deslizante simple)
const voteBuckets: Record<string,{ count:number; reset:number }> = {};
const MAX_VOTES_PER_MINUTE = 30;
const WINDOW_MS = 60_000;
function rateLimitVote(req:any,res:any,next:any){
	const userId = req.user?.id || req.auth?.userId || req.userId || req.ip;
	const key = String(userId);
	const now = Date.now();
	let bucket = voteBuckets[key];
	if (!bucket || now > bucket.reset){
		bucket = { count:0, reset: now + WINDOW_MS };
		voteBuckets[key] = bucket;
	}
	bucket.count++;
	if (bucket.count > MAX_VOTES_PER_MINUTE){
		return res.status(429).json({ error: 'Rate limit de votos excedido. Intenta más tarde.' });
	}
	next();
}

const router = Router();

router.use(requireAuth);

type CacheEntry<T> = { expiresAt: number; payload: T };
const LIST_CACHE_TTL = 30_000; // 30 segundos
const listCacheStore = new Map<string, CacheEntry<any>>();

function cacheList(req: any, res: any, next: any) {
  const userId = req.user?.id || req.auth?.userId || req.userId || req.ip;
  const key = `${userId}:${req.originalUrl}`;
  const now = Date.now();
  const cached = listCacheStore.get(key);
  if (cached && cached.expiresAt > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached.payload);
  }
  res.setHeader('X-Cache', 'MISS');
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      listCacheStore.set(key, { payload: body, expiresAt: Date.now() + LIST_CACHE_TTL });
    }
    return originalJson(body);
  };
  return next();
}

// Solo denuncias del usuario autenticado (nuevo endpoint)
router.get('/misDenuncias', DenunciaController.getMine);
// Alias temporal para compatibilidad (deprecate pronto)
router.get('/mias', (req, res, next) => {
        console.warn('[DEPRECATION] /denuncias/mias será removido, usa /denuncias/misDenuncias');
        return DenunciaController.getMine(req, res);
});

// Crear (usuarioId se toma del token internamente)
router.post('/', DenunciaController.create);

// (Opcional) Admin / roles para ver todas
router.get('/', cacheList, DenunciaController.getAll);

router.get('/:id', DenunciaController.getById);
router.post('/:id/vote', requireAuth, rateLimitVote, DenunciaController.vote);
router.patch('/:id', DenunciaController.update);
router.delete('/:id', DenunciaController.delete);
router.patch('/:id/validar', DenunciaController.validar);

export default router;
