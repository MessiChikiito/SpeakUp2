import { DenunciaApplicationService } from '../application/denuncia/DenunciaApplicationService';
import { IDenunciaRepository } from '../domain/denuncia/IDenunciaRepository';

// Tabla de transiciones esperadas para validar lógica de delta (score final relativo)
// Probamos secuencia real invocando vote() con distintos valores y verificamos que el repo
// recibe las llamadas correctas y el resultado encadena userVote.

describe('Transiciones de voto denuncia', () => {
  let repo: jest.Mocked<IDenunciaRepository>;
  let service: DenunciaApplicationService;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllRanked: jest.fn(),
      findByIdWithUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validar: jest.fn(),
      findByUser: jest.fn(),
      vote: jest.fn(),
    } as any;
    service = new DenunciaApplicationService(repo);
  });

  test('Secuencia 0 -> +1 -> -1 -> 0', async () => {
    // Preparamos respuestas simulando estado acumulado tras cada voto
    repo.vote
      .mockResolvedValueOnce({ id:1, score:1, upCount:1, downCount:0, userVote:1 } as any) // 0 -> +1
      .mockResolvedValueOnce({ id:1, score:-1, upCount:1, downCount:1, userVote:-1 } as any) // +1 -> -1 (delta -2)
      .mockResolvedValueOnce({ id:1, score:0, upCount:1, downCount:0, userVote:0 } as any);  // -1 -> 0 (+1)

    const r1 = await service.vote(1, 10, 1);
    expect(r1?.score).toBe(1);
    const r2 = await service.vote(1, 10, -1);
    expect(r2?.score).toBe(-1);
    const r3 = await service.vote(1, 10, 0);
    expect(r3?.score).toBe(0);

    expect(repo.vote).toHaveBeenCalledTimes(3);
    expect(repo.vote.mock.calls.map(c => c[2])).toEqual([1,-1,0]);
  });

  test('Secuencia 0 -> -1 -> +1 -> +1 (idempotente)', async () => {
    repo.vote
      .mockResolvedValueOnce({ id:2, score:-1, upCount:0, downCount:1, userVote:-1 } as any) // 0 -> -1
      .mockResolvedValueOnce({ id:2, score:1, upCount:1, downCount:1, userVote:1 } as any) // -1 -> +1 (+2)
      .mockResolvedValueOnce({ id:2, score:1, upCount:1, downCount:1, userVote:1 } as any); // +1 -> +1 (sin cambio)

    const a = await service.vote(2, 33, -1);
    expect(a?.score).toBe(-1);
    const b = await service.vote(2, 33, 1);
    expect(b?.score).toBe(1);
    const c = await service.vote(2, 33, 1);
    expect(c?.score).toBe(1);
    expect(repo.vote).toHaveBeenCalledTimes(3);
  });

  test('Unvote desde +1 y desde -1', async () => {
    repo.vote
      .mockResolvedValueOnce({ id:3, score:1, upCount:1, downCount:0, userVote:1 } as any) // 0->+1
      .mockResolvedValueOnce({ id:3, score:0, upCount:1, downCount:0, userVote:0 } as any) // +1->0
      .mockResolvedValueOnce({ id:3, score:-1, upCount:1, downCount:1, userVote:-1 } as any) // 0->-1
      .mockResolvedValueOnce({ id:3, score:0, upCount:1, downCount:0, userVote:0 } as any); // -1->0

    const s1 = await service.vote(3, 7, 1);
    expect(s1?.userVote).toBe(1);
    const s2 = await service.vote(3, 7, 0);
    expect(s2?.userVote).toBe(0);
    const s3 = await service.vote(3, 7, -1);
    expect(s3?.userVote).toBe(-1);
    const s4 = await service.vote(3, 7, 0);
    expect(s4?.userVote).toBe(0);
    expect(repo.vote).toHaveBeenCalledTimes(4);
  });
});