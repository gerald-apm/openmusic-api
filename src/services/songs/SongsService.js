/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongResponse, mapSongsResponse } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const albumPrefix = 'song-';
    const id = albumPrefix.concat(nanoid(16));
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan.');
    }

    return result.rows.map(mapSongResponse)[0];
  }

  async getSongs({ title, performer }) {
    let queryText = 'SELECT * FROM songs';
    const queryCall = {
      text: queryText,
      values: undefined,
    };
    if (title !== undefined) {
      if (performer !== undefined) {
        queryText += ' WHERE title ILIKE $1 AND performer ILIKE $2';
        queryCall.text = queryText;
        queryCall.values = [`%${title}%`, `%${performer}%`];
      } else {
        queryText += ' WHERE title ILIKE $1';
        queryCall.text = queryText;
        queryCall.values = [`%${title}%`];
      }
    } else if (performer !== undefined) {
      queryText += ' WHERE performer ILIKE $1';
      queryCall.text = queryText;
      queryCall.values = [`%${performer}%`];
    }
    const queryResult = await this._pool.query(queryCall);

    if (!queryResult.rows.length) {
      throw new NotFoundError('Terjadi galat ketika mengambil lagu.');
    }

    return queryResult.rows.map(mapSongsResponse);
  }

  async getSongsByAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongsResponse);
  }

  async getSongsByTitle(title) {
    const query = {
      text: 'SELECT * FROM songs WHERE title = $1',
      values: [title],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongsResponse);
  }

  async getSongsByPerformer(performer) {
    const query = {
      text: 'SELECT * FROM songs WHERE performer = $1',
      values: [performer],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongsResponse);
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan.');
    }
  }
}

module.exports = SongsService;
