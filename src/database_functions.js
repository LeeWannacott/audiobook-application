export function createTablesDB(db) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testShelve22 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_copyright_year text, audiobook_genres text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testaudio14 (id integer primary key not null, audiobook_id text not null unique, audiotrack_progress_bars text, current_audiotrack_positions text, audiobook_shelved int, audiobook_rating int);"
    );
  });
}

export function createHistoryTableDB(db) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testHistory14 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_copyright_year text, audiobook_genres text);"
    );
  });
}

export function addAudiobookToHistoryDB(
  db,
  audiobook_rss_url,
  audiobook_id,
  audiobook_image,
  audiobook_title,
  audiobook_author_first_name,
  audiobook_author_last_name,
  audiobook_total_time,
  audiobook_copyright_year,
  audiobook_genres
) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testHistory14 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_copyright_year, audiobook_genres) values (?,?,?,?,?,?,?,?,?)",
      [
        audiobook_rss_url,
        audiobook_id,
        audiobook_image,
        audiobook_title,
        audiobook_author_first_name,
        audiobook_author_last_name,
        audiobook_total_time,
        audiobook_copyright_year,
        audiobook_genres,
      ]
    );
  }, null);
}

export function deleteAudiobookHistoryDB(db) {
  db.transaction((tx) => {
    tx.executeSql("delete from testHistory14");
  }, null);
}

export function shelveAudiobookDB(
  db,
  audiobook_rss_url,
  audiobook_id,
  audiobook_image,
  audiobook_title,
  audiobook_author_first_name,
  audiobook_author_last_name,
  audiobook_total_time,
  audiobook_copyright_year,
  audiobook_genres
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
      "insert into testShelve22 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_copyright_year, audiobook_genres) values (?,?,?,?,?,?,?,?,?)",
      [
        audiobook_rss_url,
        audiobook_id,
        audiobook_image,
        audiobook_title,
        audiobook_author_first_name,
        audiobook_author_last_name,
        audiobook_total_time,
        audiobook_copyright_year,
        audiobook_genres,
      ]
    );
    tx.executeSql("select * from testShelve22", [], (_, { rows }) => {
      console.log(JSON.stringify(rows));
      console.log(rows);
    });
  }, null);
}

export function updateAudioTrackPositionsDB(
  db,
  audiotrack_progress_bars,
  current_audiotrack_positions,
  audiobook_id
) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testaudio14 set audiotrack_progress_bars=?,current_audiotrack_positions=? where audiobook_id=?;`,
      [audiotrack_progress_bars, current_audiotrack_positions, audiobook_id]
    );
  });
}

export function updateBookShelveDB(db, audiobook_id, audiobook_shelved) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testaudio14 set audiobook_shelved=? where audiobook_id=?;`,
      [audiobook_shelved, audiobook_id]
    );
  });
}

export function updateAudiobookRatingDB(db, audiobook_id, audiobook_rating) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testaudio14 set audiobook_rating=? where audiobook_id=?;`,
      [audiobook_rating, audiobook_id]
    );
  });
  db.transaction((tx) => {
    tx.executeSql("select * from testaudio14", [], (_, { rows }) => {
      console.log(rows);
    });
  });
}

export function initialAudioBookStoreDB(
  db,
  audiobook_id,
  audiotrack_progress_bars,
  current_audiotrack_positions,
  audiobook_shelved,
  audiobook_rating
) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testaudio14(audiobook_id, audiotrack_progress_bars, current_audiotrack_positions,audiobook_shelved,audiobook_rating) values(?,?,?,?,?)",
      [
        audiobook_id,
        audiotrack_progress_bars,
        current_audiotrack_positions,
        audiobook_shelved,
        audiobook_rating,
      ]
    );
  });

  db.transaction((tx) => {
    tx.executeSql("select * from testaudio14", [], (_, { rows }) => {});
  });
}

export function removeShelvedAudiobookDB(db, audiobook_id) {
  if (audiobook_id === null || audiobook_id === "") {
    return false;
  }
  db.transaction((tx) => {
    tx.executeSql("delete from testShelve22 where audiobook_id=?", [
      audiobook_id,
    ]);
  }, null);
}
