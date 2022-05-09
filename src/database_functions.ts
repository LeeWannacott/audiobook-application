import AsyncStorage from "@react-native-async-storage/async-storage";

export function createShelveTable(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "create table if not exists testshelve25 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_total_time_secs text, audiobook_copyright_year text, audiobook_genres text, audiobook_rating text, audiobook_review_url text, audiobook_num_sections text, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);"
    );
  });
}

export function createAudioBookDataTable(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "create table if not exists testaudio18 (id integer primary key not null, audiobook_id text not null unique, audiotrack_progress_bars text, current_audiotrack_positions text, audiobook_shelved int, audiobook_rating text, listening_progress_percent text, current_listening_time text);"
    );
  });
}

export function createHistoryTableDB(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "create table if not exists testHistory15 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_total_time_secs text, audiobook_copyright_year text, audiobook_genres text, audiobook_rating text, audiobook_review_url text, audiobook_num_sections text, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);"
    );
  });
}

export function addAudiobookToHistoryDB(db: any, bookDataForHistory: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "insert into testHistory15 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_total_time_secs, audiobook_copyright_year, audiobook_genres, audiobook_rating, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        bookDataForHistory.audiobook_rss_url,
        bookDataForHistory.audiobook_id,
        bookDataForHistory.audiobook_image,
        bookDataForHistory.audiobook_title,
        bookDataForHistory.audiobook_author_first_name,
        bookDataForHistory.audiobook_author_last_name,
        bookDataForHistory.audiobook_total_time,
        bookDataForHistory.audiobook_total_time_secs,
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

export function deleteAudiobookHistoryDB(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql("delete from testHistory15");
  }, null);
}

export function shelveAudiobookDB(db: any, shelveData: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "insert into testshelve25 (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_total_time_secs, audiobook_copyright_year, audiobook_genres, audiobook_rating, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        shelveData.audiobook_rss_url,
        shelveData.audiobook_id,
        shelveData.audiobook_image,
        shelveData.audiobook_title,
        shelveData.audiobook_author_first_name,
        shelveData.audiobook_author_last_name,
        shelveData.audiobook_total_time,
        shelveData.audiobook_total_time_secs,
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
    tx.executeSql("select * from testshelve25", [], (_, { rows }) => {});
  }, null);
}

export function updateAudioTrackPositionsDB(
  db: any,
  audiotrackProgress:any,
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update testaudio18 set audiotrack_progress_bars=?,current_audiotrack_positions=?,listening_progress_percent=?,current_listening_time=? where audiobook_id=?;`,
      [
        audiotrackProgress.audiotrack_progress_bars,
        audiotrackProgress.current_audiotrack_positions,
        audiotrackProgress.listening_progress_percent,
        audiotrackProgress.current_listening_time,
        audiotrackProgress.audiobook_id,
      ]
    );
  });
  db.transaction((tx: any) => {
    tx.executeSql("select * from testaudio18", [], (_, { rows }) => {
      console.log("banana", rows);
    });
  });
}

export function updateBookShelveDB(
  db: any,
  audiobook_id: any,
  audiobook_shelved: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update testaudio18 set audiobook_shelved=? where audiobook_id=?;`,
      [audiobook_shelved, audiobook_id]
    );
  });
}

export function updateRatingForHistory(
  db: any,
  audiobook_id: any,
  audiobook_rating: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update testHistory15 set audiobook_rating=? where audiobook_id=?;`,
      [audiobook_rating, audiobook_id]
    );
  });

  // db.transaction((tx: any) => {
  // tx.executeSql("select * from testaudio18", [], (_, { rows }) => {
  // console.log(rows);
  // });
  // });
}

export function updateListeningProgressDB(
  db: any,
  listening_progress_percent: any,
  current_listening_time: any,
  audiobook_id: any
) {
  console.log(
    "progress",
    listening_progress_percent,
    current_listening_time,
    audiobook_id
  );
  console.log(
    typeof listening_progress_percent,
    typeof current_listening_time,
    typeof audiobook_id
  );

  db.transaction((tx: any) => {
    tx.executeSql(
      `update testaudio18 set listening_progress_percent=?,current_listening_time=? where audiobook_id=?;`,
      [listening_progress_percent, current_listening_time, audiobook_id]
    );
  });
  db.transaction((tx: any) => {
    tx.executeSql("select * from testaudio18", [], (_, { rows }) => {
      console.log("banana", rows);
    });
  });
}

export function updateAudiobookRatingDB(
  db: any,
  audiobook_id: any,
  audiobook_rating: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update testaudio18 set audiobook_rating=? where audiobook_id=?;`,
      [audiobook_rating, audiobook_id]
    );
  });
}

export function initialAudioBookStoreDB(db: any, initAudioBookData: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      "insert into testaudio18(audiobook_id, audiotrack_progress_bars, current_audiotrack_positions, audiobook_shelved, audiobook_rating) values(?,?,?,?,?)",

      [
        initAudioBookData.audiobook_id,
        initAudioBookData.audiotrack_progress_bars,
        initAudioBookData.current_audiotrack_positions,
        initAudioBookData.audiobook_shelved,
        initAudioBookData.audiobook_rating,
      ]
    );
  });

  // db.transaction((tx:any) => {
  // tx.executeSql("select * from testaudio18", [], (_, { rows }) => {});
  // console.log(rows)
  // });
}

export function removeShelvedAudiobookDB(db: any, audiobook_id: any) {
  if (audiobook_id === null || audiobook_id === "") {
    return false;
  }
  db.transaction((tx: any) => {
    tx.executeSql("delete from testshelve25 where audiobook_id=?", [
      audiobook_id,
    ]);
  }, null);
}

export const storeAsyncData = async (key: any, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncData = async (key: any) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
