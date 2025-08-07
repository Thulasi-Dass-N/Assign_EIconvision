import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'PhotoJournal.db', location: 'default' });

export const initDB = () => {
  db.transaction((tx:any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, title TEXT, timestamp TEXT);`
    );
  });
};

export const savePhotoEntry = (uri: string, title: string, timestamp: string) => {
  db.transaction((tx:any) => {
    tx.executeSql(`INSERT INTO entries (uri, title, timestamp) VALUES (?, ?, ?)`, [uri, title, timestamp]);
  });
};

export const getPhotoEntries = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(`SELECT * FROM entries`, [], (_:any, results:any) => {
        const rows = results.rows;
        const entries: any[] = [];
        for (let i = 0; i < rows.length; i++) entries.push(rows.item(i));
        resolve(entries);
      });
    }, reject);
  });
};

export const deleteEntry = (id: number) => {
  db.transaction((tx:any) => {
    tx.executeSql(`DELETE FROM entries WHERE id = ?`, [id]);
  });
};
