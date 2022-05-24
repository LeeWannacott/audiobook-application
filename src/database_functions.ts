import AsyncStorage from "@react-native-async-storage/async-storage";

export const audiobookShelfTableName = "testshelve27";
export function createShelveTable(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `create table if not exists ${audiobookShelfTableName} (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_total_time_secs int, audiobook_copyright_year int, audiobook_genres text, audiobook_review_url text, audiobook_num_sections int, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);`
    );
  });
}

export const audiobookProgressTableName = "testaudio23";
export function createAudioBookDataTable(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `create table if not exists ${audiobookProgressTableName} (id integer primary key not null, audiobook_id text not null unique, audiotrack_progress_bars text, current_audiotrack_positions text, audiobook_shelved int, audiobook_rating real, listening_progress_percent real, current_listening_time int, current_audiotrack_index int);`
    );
  });
}

export const audiobookHistoryTableName = "testHistory20";
export function createHistoryTableDB(db: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `create table if not exists ${audiobookHistoryTableName}  (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text, audiobook_title text, audiobook_author_first_name text, audiobook_author_last_name text, audiobook_total_time text, audiobook_total_time_secs int, audiobook_copyright_year int, audiobook_genres text, audiobook_review_url text, audiobook_num_sections int, audiobook_ebook_url text, audiobook_zip text, audiobook_language text);`
    );
  });
}

export function addAudiobookToHistoryDB(db: any, bookDataForHistory: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `insert into ${audiobookHistoryTableName} (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_total_time_secs, audiobook_copyright_year, audiobook_genres, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
    tx.executeSql(`delete from ${audiobookHistoryTableName}`);
  }, null);
}

export function shelveAudiobookDB(db: any, audiobookToShelve: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `insert into ${audiobookShelfTableName} (audiobook_rss_url, audiobook_id, audiobook_image, audiobook_title, audiobook_author_first_name, audiobook_author_last_name, audiobook_total_time, audiobook_total_time_secs, audiobook_copyright_year, audiobook_genres, audiobook_review_url, audiobook_num_sections, audiobook_ebook_url, audiobook_zip, audiobook_language) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        audiobookToShelve.audiobook_rss_url,
        audiobookToShelve.audiobook_id,
        audiobookToShelve.audiobook_image,
        audiobookToShelve.audiobook_title,
        audiobookToShelve.audiobook_author_first_name,
        audiobookToShelve.audiobook_author_last_name,
        audiobookToShelve.audiobook_total_time,
        audiobookToShelve.audiobook_total_time_secs,
        audiobookToShelve.audiobook_copyright_year,
        audiobookToShelve.audiobook_genres,
        audiobookToShelve.audiobook_review_url,
        audiobookToShelve.audiobook_num_sections,
        audiobookToShelve.audiobook_ebook_url,
        audiobookToShelve.audiobook_zip,
        audiobookToShelve.audiobook_language,
      ]
    );
  }, null);
}

export function updateAudioTrackPositionsDB(db: any, audiotrackProgress: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update ${audiobookProgressTableName} set audiotrack_progress_bars=?,current_audiotrack_positions=?,listening_progress_percent=?,current_listening_time=? where audiobook_id=?;`,
      [
        audiotrackProgress.audiotrack_progress_bars,
        audiotrackProgress.current_audiotrack_positions,
        audiotrackProgress.listening_progress_percent,
        audiotrackProgress.current_listening_time,
        audiotrackProgress.audiobook_id,
      ]
    );
  });
}

export function updateAudioTrackIndexDB(db: any, audioTrackIndex: any, audiobook_id:any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update ${audiobookProgressTableName} set current_audiotrack_index=? where audiobook_id=?;`,
      [
        audioTrackIndex,
        audiobook_id,
      ]
    );
  });
}

export function updateBookShelveDB(
  db: any,
  audiobook_id: any,
  audiobook_shelved: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update ${audiobookProgressTableName} set audiobook_shelved=? where audiobook_id=?;`,
      [audiobook_shelved, audiobook_id]
    );
  });
}

export function updateListeningProgressDB(
  db: any,
  listening_progress_percent: any,
  current_listening_time: any,
  audiobook_id: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update ${audiobookProgressTableName} set listening_progress_percent=?,current_listening_time=? where audiobook_id=?;`,
      [listening_progress_percent, current_listening_time, audiobook_id]
    );
  });
  // db.transaction((tx: any) => {
  // tx.executeSql(
  // `select * from ${audiobookProgressTableName}`,
  // [],
  // (_, { rows }) => {
  // console.log("banana", rows);
  // }
  // );
  // });
}

export function updateAudiobookRatingDB(
  db: any,
  audiobook_id: any,
  audiobook_rating: any
) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `update ${audiobookProgressTableName} set audiobook_rating=? where audiobook_id=?;`,
      [audiobook_rating, audiobook_id]
    );
  });
}

export function initialAudioBookStoreDB(db: any, initAudioBookData: any) {
  db.transaction((tx: any) => {
    tx.executeSql(
      `insert into ${audiobookProgressTableName}(audiobook_id, audiotrack_progress_bars, current_audiotrack_positions, audiobook_shelved, audiobook_rating) values(?,?,?,?,?)`,

      [
        initAudioBookData.audiobook_id,
        initAudioBookData.audiotrack_progress_bars,
        initAudioBookData.current_audiotrack_positions,
        initAudioBookData.audiobook_shelved,
        initAudioBookData.audiobook_rating,
      ]
    );
  });
}

export function removeShelvedAudiobookDB(db: any, audiobook_id: any) {
  if (audiobook_id === null || audiobook_id === "") {
    return false;
  }
  db.transaction((tx: any) => {
    tx.executeSql(
      `delete from ${audiobookShelfTableName} where audiobook_id=?`,
      [audiobook_id]
    );
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
