/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const BaseResponse = require('../../dto/BaseResponse');

class AlbumsHandler {
  constructor(service, validator) {
    this._response = new BaseResponse();
    this._service = service;
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.baseErrorHandler = this.baseErrorHandler.bind(this);
  }

  baseErrorHandler(error, h) {
    if (error instanceof ClientError) {
      return h.response(this._response.exceptionResponse(error.message))
        .code(error.statusCode);
    }

    // Server ERROR!
    console.error(error);
    return h.response(this._response.internalErrorResponse(error.message))
      .code(500);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });
      return h.response(this._response.normalResponse({ albumId }))
        .code(201);
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return this._response.normalResponse({ album });
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      await this._service.editAlbumById(id, request.payload);
      return this._response.normalMessageResponse('Album berhasil diperbarui.');
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
      return this._response.normalMessageResponse('Album berhasil dihapus.');
    } catch (error) {
      return this.baseErrorHandler(error, h);
    }
  }
}

module.exports = AlbumsHandler;
