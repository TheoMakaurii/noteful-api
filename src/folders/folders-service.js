const FoldersService = {
    getAllFolders(knex){
        return knex.select('*').from('folders_table')
    },

    insertFolder(knex, newFolder){
        return knex
            .insert(newFolder)
            .into('folders_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id){
        return knex 
            .from('folders_table')
            .select('*')
            .where({id})
            .first()
    },

    deleteFolder(knex, id) {
        return knex('folders_table')
          .where({ id })
          .delete()
      },
}

module.exports = FoldersService