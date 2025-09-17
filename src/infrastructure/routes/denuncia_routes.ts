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
router.get('/', DenunciaController.getAll);

router.get('/:id', DenunciaController.getById);
router.post('/:id/vote', requireAuth, rateLimitVote, DenunciaController.vote);
router.patch('/:id', DenunciaController.update);
router.delete('/:id', DenunciaController.delete);
router.patch('/:id/validar', DenunciaController.validar);

export default router;
