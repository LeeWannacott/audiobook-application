import React from "react";
import { useState } from "react";


import {
  View,
} from "react-native";


import { openDatabase } from "../utils";
import {
  audiobookHistoryTableName,
  audiobookProgressTableName,
} from "../database_functions";

import ShelfForBookshelfAndHistory from "../components/shelfForBookshelfAndHistory";

const db = openDatabase();

// global scope
let lolcache = {};


function History() {
  const [audiobookHistory, setAudiobookHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);


  function getShelvedBooks(pickerAndQueryStatePassedIn: {
    orderBy: string;
    order: string;
  }) {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${audiobookHistoryTableName} inner join ${audiobookProgressTableName} on ${audiobookProgressTableName}.audiobook_id = ${audiobookHistoryTableName}.audiobook_id ${pickerAndQueryStatePassedIn.orderBy} ${pickerAndQueryStatePassedIn.order} limit 100`,
        [],
        (_, { rows }) => {
          let start = performance.now();
          let newHistory = [];
          for (let row of rows._array) {
            if (
              Object.prototype.hasOwnProperty.call(lolcache, row.audiobook_id)
            ) {
              newHistory.push(lolcache[row.audiobook_id]);
            } else {
              lolcache[row.audiobook_id] = row;
              newHistory.push(row);
            }
          }
          setAudiobookHistory(newHistory);
          // setAudiobookHistory(rows["_array"]);
          console.log("yogibear", rows["_array"]);
          let end = performance.now();
          console.log("time: ", end - start);
          setLoadingHistory(false);
        }
      );
    }, null);
  }
  const asyncDataKeyNameForPickerAndToggle = "pickerAndQueryDataHistory"

  return (
    <View>
      <ShelfForBookshelfAndHistory
        getShelvedBooks={getShelvedBooks}
        audiobookHistory={audiobookHistory}
        loadingHistory={loadingHistory}
        asyncDataKeyName={asyncDataKeyNameForPickerAndToggle}
      />
    </View>
  );
}

export default History;

