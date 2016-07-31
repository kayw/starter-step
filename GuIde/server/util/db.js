/* eslint no-console:0 */
export function ensureDB(rethink, db, tables, callback) {
  rethink.dbList().run().then(dbs => {
    let found = false;
    for (let idx = 0; idx < dbs.length; idx++) {
      if (dbs[idx] === db) {
        found = true;
        break;
      }
    }
    if (found) {
      const createTables = [];
      rethink.db(db).tableList().run()
        .then(ts => {
          for (let j = 0; j < tables.length; j++) {
            let existed = false;
            for (let i = 0; i < ts.length; i++) {
              if (ts[i] === tables[j]) {
                existed = true;
                break;
              }
            }
            if (!existed) {
              createTables.push(tables[j]);
            }
          }
          const dbOps = [];
          createTables.forEach(tb => {
            dbOps.push(rethink.db(db).tableCreate(tb).run());
          });
          Promise.all(dbOps).then(() => {
            callback();
          });
        });
    } else {
      rethink.dbCreate(db).run().then(() => {
        const dbOps = [];
        tables.forEach(tb => {
          dbOps.push(rethink.db(db).tableCreate(tb).run());
        });
        Promise.all(dbOps).then(() => {
          callback();
        });
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
}
