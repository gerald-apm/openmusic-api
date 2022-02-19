/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'NUMERIC(8,2)',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'NUMERIC(8,2)',
    },
    album_id: {
      type: 'VARCHAR(64)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
  pgm.dropTable('albums');
};
