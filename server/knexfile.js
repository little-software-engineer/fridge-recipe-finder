

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// knexfile.js

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/recipes.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }
};
