const BaseResponse = require('../dto/BaseResponse');
const ClientError = require('../exceptions/ClientError');

const mapAlbumResponse = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year: Number(year),
});

const mapSongResponse = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year: Number(year),
  performer,
  genre,
  duration: Number(duration),
  albumId,
});

const mapSongsResponse = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const baseErrorHandler = (error, h) => {
  const baseResponse = new BaseResponse();
  if (error instanceof ClientError) {
    console.error(error);
    return h.response(baseResponse.exceptionResponse(error.message))
      .code(error.statusCode);
  }

  // Server ERROR!
  console.error(error);
  return h.response(baseResponse.internalErrorResponse(error.message))
    .code(500);
};

module.exports = {
  mapAlbumResponse, baseErrorHandler, mapSongsResponse, mapSongResponse,
};
