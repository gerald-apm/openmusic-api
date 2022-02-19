/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const { baseErrorHandler } = require('../../utils');
const BaseResponse = require('../../dto/BaseResponse');

class SongsHandler {
  constructor(service, validator) {
    this._response = new BaseResponse();
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    this.baseErrorHandler = baseErrorHandler;
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;
      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });
      return h.response(this._response.normalResponse({ songId }))
        .code(201);
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return this._response.normalResponse({ song });
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await this._service.getSongs({ title, performer });
      return this._response.normalResponse({ songs });
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);
      return this._response.normalMessageResponse('Lagu berhasil diperbarui.');
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return this._response.normalMessageResponse('Lagu berhasil dihapus.');
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }
}

module.exports = SongsHandler;
