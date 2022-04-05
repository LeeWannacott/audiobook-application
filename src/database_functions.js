import AsyncStorage from "@react-native-async-storage/async-storage";

export function createTablesDB(db) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists testshelve24 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_copyright_year text, audiobook_genres text, audiobook_rating text, audiobook_review_url text, audiobook_num_sections text, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);"
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
      "create table if not exists testHistory14 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_copyright_year text, audiobook_genres text, audiobook_rating text, audiobook_review_url text, audiobook_num_sections text, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);"
    );
  });
}

export function addAudiobookToHistoryDB(db, bookDataForHistory) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testHistory14 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_copyright_year, audiobook_genres, audiobook_rating, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        bookDataForHistory.audiobook_rss_url,
        bookDataForHistory.audiobook_id,
        bookDataForHistory.audiobook_image,
        bookDataForHistory.audiobook_title,
        bookDataForHistory.audiobook_author_first_name,
        bookDataForHistory.audiobook_author_last_name,
        bookDataForHistory.audiobook_total_time,
        bookDataForHistory.audiobook_copyright_year,
        bookDataForHistory.audiobook_genres,
        bookDataForHistory.audiobook_rating,
        bookDataForHistory.audiobook_review_url,
        bookDataForHistory.audiobook_num_sections,
        bookDataForHistory.audiobook_ebook_url,
        bookDataForHistory.audiobook_zip,
        bookDataForHistory.audiobook_language,
      ]
    );
  }, null);
}

export function deleteAudiobookHistoryDB(db) {
  db.transaction((tx) => {
    tx.executeSql("delete from testHistory14");
  }, null);
}

export function shelveAudiobookDB(db, shelveData) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testshelve24 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_copyright_year, audiobook_genres, audiobook_rating, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        shelveData.audiobook_rss_url,
        shelveData.audiobook_id,
        shelveData.audiobook_image,
        shelveData.audiobook_title,
        shelveData.audiobook_author_first_name,
        shelveData.audiobook_author_last_name,
        shelveData.audiobook_total_time,
        shelveData.audiobook_copyright_year,
        shelveData.audiobook_genres,
        shelveData.audiobook_rating,
        shelveData.audiobook_review_url,
        shelveData.audiobook_num_sections,
        shelveData.audiobook_ebook_url,
        shelveData.audiobook_zip,
        shelveData.audiobook_language,
      ]
    );
    tx.executeSql("select * from testshelve24", [], (_, { rows }) => {
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

export function updateRatingForHistory(db, audiobook_id, audiobook_rating) {
  db.transaction((tx) => {
    tx.executeSql(
      `update testHistory14 set audiobook_rating=? where audiobook_id=?;`,
      [audiobook_rating, audiobook_id]
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

export function initialAudioBookStoreDB(db, initAudioBookData) {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into testaudio14(audiobook_id, audiotrack_progress_bars, current_audiotrack_positions,audiobook_shelved,audiobook_rating) values(?,?,?,?,?)",
      [
        initAudioBookData.audiobook_id,
        initAudioBookData.audiotrack_progress_bars,
        initAudioBookData.current_audiotrack_positions,
        initAudioBookData.audiobook_shelved,
        initAudioBookData.audiobook_rating,
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
    tx.executeSql("delete from testshelve24 where audiobook_id=?", [
      audiobook_id,
    ]);
  }, null);
}

export const storeAsyncData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
