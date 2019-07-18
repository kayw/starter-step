/* eslint no-console:0 */
// https://github.com/rethinkdb/rethinkdb/issues/3512
// https://github.com/stuartpb/endex
export function ensureDB(rethink, conn, db, tables) {
  const branches = [];
  if (db) {
    conn.use(db);
    branches.push(rethink.branch(
      rethink.dbList().contains(db),
      rethink.expr({ config_changes: [], dbs_created: 0 }).merge(rethink.db(db).config()),
      rethink.dbCreate(db).merge(rethink.db(db).config())
    ));
  }
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    branches.push(rethink.branch(
      rethink.tableList().contains(table),
      rethink.expr({ config_changes: [], tables_created: 0 }).merge(rethink.table(table).config()),
      rethink.tableCreate(table).merge(rethink.table(table).config())
    ));
  }
  return new Promise((resolve, reject) => {
    rethink.expr(branches).run(conn).then(resp => resolve(resp), reject);
  });
}
