import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import { message } from "antd";
import "../styles/Table.scss";
import { v4 as id } from "uuid";

type Error = { message: string } | undefined;

type Columns = undefined | string;
type Rows = undefined | string;
type Lines = [] | string[][];
type Loading = undefined | boolean;

function Table() {
  let { search } = useLocation();
  const [columns, setColumns] = useState<Columns>();
  const [rows, setRows] = useState<Rows>();
  const [error, setError] = useState<Error>();
  const [lines, setLines] = useState<Lines>([]);
  const [loading, setLoading] = useState<Loading>();

  const sendError = (type: string) => {
    setError({
      message: `Query argument '${type}' unknown. Missing arguments: '${type}'`,
    });
  };

  // check if query includes arguments
  const isQueryValid = (query: string) => {
    if (query) {
      if (!/col=/.test(query)) {
        sendError("col");
        return false;
      } else if (!/row=/.test(query)) {
        sendError("row");
        return false;
      } else {
        setError(undefined);
        return true;
      }
    } else {
      sendError("col, row");
      return false;
    }
  };

  // if query includes arguments, will stock the value as a state
  const fetchQuery = () => {
    if (isQueryValid(search)) {
      const colRegex = /(?<=col=)[1-9][0-9]*/;
      const rowRegex = /(?<=row=)[0-9]*/;
      const colCount = search.match(colRegex);
      const rowCount = search.match(rowRegex);
      if (colCount && rowCount) {
        setColumns(colCount[0]);
        setRows(rowCount[0]);
        setLoading(false);
      }
      if (colCount) {
        setColumns(colCount[0]);
      } else {
        sendError("col");
        return;
      }
      if (rowCount) {
        setRows(rowCount[0]);
      } else {
        sendError("row");
        return;
      }
    }
  };
  // one side effect to fetch query values
  useEffect(() => {
    fetchQuery();
  }, []);

  // one side effect to display a pop error message of 5s
  useEffect(() => {
    if (error) message.error({ content: error.message, duration: 5 });
  }, [error]);

  // create an array based on the query value
  let cols = new Array();
  let rws = new Array();
  if (columns && rows) {
    cols = Array.from(Array(Number(columns)));
    rws = Array.from(Array(Number(rows)));
  }

  // create an alphabet array
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  let alphabet = alpha.map((x) => String.fromCharCode(x));

  // multiply alphabat size according to number of cells
  const enlargeAlphabet = () => {
    const cellCount = (Number(columns) - 1) * Number(rows);
    const alphabetCount = Math.ceil(cellCount / 26);
    const alphas = [];
    for (let i = 0; i < alphabetCount; i++) {
      alphas.push(alphabet);
    }
    alphabet = alphas.flat();
  };

  // stock all the letters that are displayed in each row
  React.useMemo(() => {
    // when
    if (Number(columns) > 1) {
      enlargeAlphabet();
      const lines = [];
      let range = Number(columns) - 1;
      for (let i = 0; i < Number(rows); i++) {
        const letters = alphabet.slice(i * range, i * range + range);
        lines.push(letters);
      }
      setLines(lines);
    }
  }, [loading]);

  // variables
  let count = 0;
  let letter = "";
  let index = 0;
  let lineCount = 0;

  return (
    <div className="page">
      {!error && (
        <table>
          <thead>
            <tr className="tr">
              {cols.map((col, index, arr) => (
                <th key={id()} className="t-common th">{`Disk ${index}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rws.map((row, r, arr) => {
              count++;
              lineCount = 0;
              if (r === 0) {
                count = Number(columns) - 1;
              } else if (count > Number(columns) - 1) {
                count = 0;
              }

              const idr = id();
              return (
                <tr key={idr} className={`tr ${r % 2 !== 0 && "dark"}`}>
                  {cols.map((col, c, arr) => {
                    const letters = lines[r];
                    if (index === alphabet.length - 1) index = 0;
                    if ((r !== 0 || c !== 0) && c !== count) index++;
                    if (c !== count && letters) {
                      letter = letters[lineCount];
                      lineCount++;
                    }

                    const idc = id();
                    return (
                      <td
                        id={idc}
                        key={idc}
                        className={`t-common td ${
                          c === arr.length - 1
                            ? "t-last-border"
                            : "t-common-border"
                        }`}
                      >
                        Block{" "}
                        {c === count && lines.length > 0
                          ? lines[r].join(" + ")
                          : letter}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
