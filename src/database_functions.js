export function createTablesDB(db) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testShelve15 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testaudio13 (id integer primary key not null, audiobook_id text not null unique, audiotrack_progress_bars text, current_audiotrack_positions text, audiobook_shelved int);"
    );
  });
}

export function updateAudioTrackPositionsDB(
  db,
  audiotrack_progress_bars,
  current_audiotrack_positions,
  audiobook_id
) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testaudio13 set audiotrack_progress_bars=?,current_audiotrack_positions=? where audiobook_id=?;`,
      [audiotrack_progress_bars, current_audiotrack_positions, audiobook_id]
    );
  });
}

export function shelveAudiobookDB(
  db,
  audiobook_rss_url,
  audiobook_id,
  audiobook_image
) {
  // is text empty?
  if (audiobook_rss_url === null || audiobook_rss_url === "") {
    return false;
  }

  if (audiobook_id === null || audiobook_id === "") {
    return false;
  }

  if (audiobook_image === null || audiobook_image === "") {
    return false;
  }

  db.transaction((tx) => {
    tx.executeSql(
      "insert into testShelve15 (audiobook_rss_url, audiobook_id, audiobook_image) values (?,?,?)",
      [audiobook_rss_url, audiobook_id, audiobook_image]
    );
    tx.executeSql("select * from testShelve15", [], (_, { rows }) => {
      console.log(JSON.stringify(rows));
      console.log(rows);
    });
  }, null);
}

export function updateBookShelveDB(db, audiobook_id, audiobook_shelved) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testaudio13 set audiobook_shelved=? where audiobook_id=?;`,
      [audiobook_shelved, audiobook_id]
    );
  });

  db.transaction((tx) => {
    tx.executeSql("select * from testaudio13", [], (_, { rows }) => {
      console.log("updating shelve", JSON.stringify(rows));
    });
  }, null);
}

export function initialAudioBookStoreDB(
  db,
  audiobook_id,
  audiotrack_progress_bars,
  current_audiotrack_positions,
  audiobook_shelved
) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testaudio13(audiobook_id, audiotrack_progress_bars, current_audiotrack_positions,audiobook_shelved) values(?,?,?,?)",
      [
        audiobook_id,
        audiotrack_progress_bars,
        current_audiotrack_positions,
        audiobook_shelved,
      ]
    );
  });

  db.transaction((tx) => {
    tx.executeSql("select * from testaudio13", [], (_, { rows }) => {
    });
  });
}

export function removeShelvedAudiobookDB(db, audiobook_id) {
  if (audiobook_id === null || audiobook_id === "") {
    return false;
  }
  db.transaction((tx) => {
    tx.executeSql("delete from testShelve15 where audiobook_id=?", [
      audiobook_id,
    ]);
  }, null);
}
