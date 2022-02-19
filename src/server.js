require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Albums Service Dependencies
const albums = require('./api/albums');
const AlbumsService = require('./services/albums/AlbumsService');
const AlbumsValidator = require('./validators/albums');

// Albums Service Dependencies
const songs = require('./api/songs');
const SongsService = require('./services/songs/SongsService');
const SongsValidator = require('./validators/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
