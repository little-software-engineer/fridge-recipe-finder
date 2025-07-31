/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('ingredients', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
        })
        .createTable('recipes', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.string('image');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('recipes')
        .dropTableIfExists('ingredients');
};