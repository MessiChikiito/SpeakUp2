import { Repository } from "typeorm";
import { DenunciaEntity } from '../entities/DenunciaEntity';
import { AppDataSource } from '../config/database';
import { CreateDenunciaDTO, UpdateDenunciaDTO } from '../../application/denuncia/dto/DenunciaDTO';
import { IDenunciaRepository } from '../../domain/denuncia/IDenunciaRepository'; // nuevo import
import { AppDataSource as ds } from '../config/database';

export class DenunciaAdapter implements IDenunciaRepository {
  private repo = AppDataSource.getRepository(DenunciaEntity);

  private toDomain(e: DenunciaEntity, userVote?: number) {
    return {
      id: e.id,
      titulo: e.titulo,
      descripcion: e.descripcion,
      categoriaId: e.categoriaId,
      ubicacion: e.ubicacion,
      gravedad: e.gravedad,
      usuarioId: e.usuarioId,
      estado: e.estado,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      score: e.score,
      upCount: e.upCount,
      downCount: e.downCount,
      userVote: userVote ?? 0,
    };
  }

  async create(dto: CreateDenunciaDTO) {
    const entity = this.repo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      categoriaId: dto.categoriaId,
      ubicacion: dto.ubicacion,
      gravedad: dto.gravedad,
      usuarioId: dto.usuarioId, // asegurado
      estado: "pendiente"
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByIdWithUser(id: number, userId?: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    if (!userId) return this.toDomain(found, 0);
    const vote = await AppDataSource.query('SELECT value FROM denuncia_vote WHERE denuncia_id=$1 AND user_id=$2 LIMIT 1', [id, userId]);
    const value = vote.length ? vote[0].value : 0;
    return this.toDomain(found, value);
  }

  async findAll() {
    const all = await this.repo.find();
    return all.map(e => this.toDomain(e));
  }

  async findAllRanked(sort: 'recent'|'top', userId?: number) {
    let orderBy = 'd.created_at DESC';
    if (sort === 'top') orderBy = 'd.score DESC, d.id DESC';
    const params: any[] = [];
    let userVoteSelect = '0 as "userVote"';
    if (userId) {
      params.push(userId);
      userVoteSelect = `COALESCE((SELECT v.value FROM denuncia_vote v WHERE v.denuncia_id = d.id AND v.user_id = $${params.length} LIMIT 1),0) as "userVote"`;
    }
    const sql = `SELECT 
        d.id, d.titulo, d.descripcion, d.categoria_id as "categoriaId", d.ubicacion,
        d.gravedad, d.usuario_id as "usuarioId", d.estado, d.created_at as "createdAt", d.updated_at as "updatedAt",
        d.score, d.up_count as "upCount", d.down_count as "downCount", ${userVoteSelect}
      FROM denuncias d
      WHERE d.status=1
      ORDER BY ${orderBy}
      LIMIT 200`;
    const rows = await AppDataSource.query(sql, params);
    return rows.map((r: any) => ({
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      categoriaId: r.categoriaId,
      ubicacion: r.ubicacion,
      gravedad: r.gravedad,
      usuarioId: r.usuarioId,
      estado: r.estado,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      score: r.score,
      upCount: r.upCount,
      downCount: r.downCount,
      userVote: r.userVote
    }));
  }

  async findByUser(userId: number) {
    const rows = await this.repo.find({
      where: { usuarioId: userId },
      order: { id: "DESC" }
    });
    return rows.map(r => this.toDomain(r));
  }

  async update(id: number, updates: UpdateDenunciaDTO) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    if (updates.titulo !== undefined) entity.titulo = updates.titulo;
    if (updates.descripcion !== undefined) entity.descripcion = updates.descripcion;
    if (updates.categoriaId !== undefined) entity.categoriaId = updates.categoriaId;
    if (updates.ubicacion !== undefined) entity.ubicacion = updates.ubicacion;
    if (updates.gravedad !== undefined) entity.gravedad = updates.gravedad;
    if (updates.estado !== undefined) entity.estado = updates.estado;
    if (updates.usuarioId !== undefined) entity.usuarioId = updates.usuarioId;
    if (updates.status !== undefined) entity.status = updates.status;
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  // Implementación faltante para cumplir la interfaz
  async validar(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    entity.estado = 'validada'; // ajusta el valor según tu dominio ('validado' / 'validada')
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: number) {
    const res = await this.repo.delete(id);
    return !!res.affected && res.affected > 0;
  }

  /**
   * Aplica un voto del usuario. value: -1 | 0 | 1
   * 0 significa "quitar" el voto previo.
   */
  async vote(denunciaId: number, userId: number, value: -1 | 0 | 1) {
    return await ds.transaction(async (manager) => {
      // Obtener denuncia
      const denuncia = await manager.getRepository(DenunciaEntity).findOne({ where: { id: denunciaId } });
      if (!denuncia) return null;

      // Obtener voto previo (query directa a la tabla raw, asumiendo nombre denuncia_vote)
      const prevVote: any = await manager.query(
        'SELECT value FROM denuncia_vote WHERE denuncia_id = $1 AND user_id = $2 LIMIT 1',
        [denunciaId, userId]
      );
      const previousValue: -1 | 0 | 1 = prevVote.length ? prevVote[0].value : 0;

      if (previousValue === value) {
        // No hay cambio; devolvemos el estado actual enriquecido
        return this.toDomain(denuncia);
      }

      // Calcular delta
      const delta = (from: number, to: number) => {
        if (from === to) return { score: 0, up: 0, down: 0 };
        // from -> to transitions
        if (from === 0 && to === 1) return { score: +1, up: +1, down: 0 };
        if (from === 0 && to === -1) return { score: -1, up: 0, down: +1 };
        if (from === 1 && to === 0) return { score: -1, up: -1, down: 0 };
        if (from === -1 && to === 0) return { score: +1, up: 0, down: -1 };
        if (from === 1 && to === -1) return { score: -2, up: -1, down: +1 };
        if (from === -1 && to === 1) return { score: +2, up: +1, down: -1 };
        return { score: 0, up: 0, down: 0 };
      };
      const d = delta(previousValue, value);

      // Aplicar en tabla de votos
      if (value === 0) {
        if (prevVote.length) {
          await manager.query('DELETE FROM denuncia_vote WHERE denuncia_id = $1 AND user_id = $2', [denunciaId, userId]);
        }
      } else if (prevVote.length) {
        await manager.query('UPDATE denuncia_vote SET value = $1, updated_at = NOW() WHERE denuncia_id = $2 AND user_id = $3', [value, denunciaId, userId]);
      } else {
        await manager.query('INSERT INTO denuncia_vote (denuncia_id, user_id, value) VALUES ($1,$2,$3)', [denunciaId, userId, value]);
      }

      // Actualizar denuncia (score y contadores) si hay cambios
      if (d.score !== 0 || d.up !== 0 || d.down !== 0) {
        await manager.query(
          `UPDATE denuncias
             SET score = COALESCE(score,0) + $1,
                 up_count = COALESCE(up_count,0) + $2,
                 down_count = COALESCE(down_count,0) + $3,
                 last_score_update = NOW()
           WHERE id = $4`,
          [d.score, d.up, d.down, denunciaId]
        );
      }

      const updated = await manager.getRepository(DenunciaEntity).findOne({ where: { id: denunciaId } });
      if (!updated) return null;
      // Obtener userVote final
      const userVoteRow = await manager.query('SELECT value FROM denuncia_vote WHERE denuncia_id=$1 AND user_id=$2 LIMIT 1',[denunciaId, userId]);
      const finalVote = userVoteRow.length ? userVoteRow[0].value : 0;
      return this.toDomain(updated, finalVote);
    });
  }
}
