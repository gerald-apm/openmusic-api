/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbumResponse } = require('../../utils');
const SongsService = require('../songs/SongsService');

class AlbumsService {
  constructor() {
    this._songsService = new SongsService();
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumPrefix = 'album-';
    const id = albumPrefix.concat(nanoid(16));
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan.');
    }

    const songs = await this._songsService.getSongsByAlbum(id);

    const resultCombined = result.rows.map(mapAlbumResponse)[0];
    return Object.assign(resultCombined, { songs });
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan.');
    }
  }
}

module.exports = AlbumsService;
