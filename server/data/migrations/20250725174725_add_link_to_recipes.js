/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
        table.string('link');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
        table.dropColumn('link');
    });
};

