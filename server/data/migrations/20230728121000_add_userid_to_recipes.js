/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
        table.dropColumn('user_id');
    });
}; 