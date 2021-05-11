import React, {useReducer, createContext, useMemo, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";
import '../css/style.css';

export const CODE  = {
  OPENED: 0, // 0 이상이면 모두 Open
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  MINE: -7,
}

const plantMine = (row, cell, mine) => {
  // console.log(row, cell, mine);
  const candidate = Array(row * cell).fill().map( (arr, i) => { return i; });
  const shuffle = [];
  while (candidate.length > (row * cell - mine)) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  // 가로 세로 배열 생성
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }
  // 지뢰 심기
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }
  // 리턴
  return data;
};

const initialState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  halted: true,
  openedCount: 0,
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';
const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME: {
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false, //Game start
        timer: 0,
      };
    }
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      //tableData[action.row] = [...state.tableData[action.row]];
      tableData.forEach( (row, i) => {
        tableData[i] = [...row];
      });
      const checked = [];
      let openedCount = 0;
      // console.log(tableData.length, tableData[0].length);
      const checkAround = (row, cell) => {
        // console.log(row, cell);
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return; // 상하좌우 없는칸은 안 열기
        }
        if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
          return; // 위의 해당사항에는 열지않음
        }
        if (checked.includes(row + '/' + cell)) {
          return; // 한 번 연칸은 무시하기
        } else {
          checked.push(row + '/' + cell);
        }
        // 지뢰개수 보여주기
        let around = [tableData[row][cell - 1], tableData[row][cell + 1],]; // 양옆
        if (tableData[row - 1]) {// 윗줄이 있다면
          around = around.concat(tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1])
        }
        if (tableData[row + 1]) {// 아랫줄이 있으면
          around = around.concat(tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1])
        }
        // 지뢰개수 표시
        const count = around.filter( (v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v) ).length;
        tableData[row][cell] = count;
        if (count === 0) { // 주변칸 오픈
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row -1, cell - 1]);
              near.push([row -1, cell]);
              near.push([row -1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            })
          }
        }
        if (CODE.NORMAL < tableData[row][cell]) { // 내 칸이 닫힌 칸이면 카운트 증가
          openedCount += 1;
        }
        tableData[row][cell] = count;
      }
      checkAround(action.row, action.cell);
      let halted = false;
      let result = '';
      // console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 승리
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다`;
      }
      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true, // Game over
      }
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      }
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      }
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      }
    }
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      }
    }
    default:
      return state;
  }
};

/*<TableContext.Provider value={value}> 들어간 변수와 동일하게 기본값으로 구색을 맞춰준다*/
export const TableContext = createContext({
  tableData: [],
  dispatch: () => {},
  halted: true,
});
const MineSweeper = () => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const {tableData, halted, timer, result} = state;
  /*TableContext.Provider 은 성능 최적화 하기가 어렵기 때문에 useMemo 를 사용하여 데이터를 캐싱하는게 좋다*/
  const value = useMemo(() => ({ tableData, halted, dispatch}), [tableData, halted]);

  useEffect(() => {
    let timer;
    if (halted === false) {
      console.log('시작');
      timer = setInterval(() => {
        dispatch({ type: INCREMENT_TIMER });
      }, 1000);
    }
    return () => {
      console.log('타이머 제거');
      clearInterval(timer);
    }
  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
      {(halted && tableData.length) ? <div>Game over...</div> : null}
    </TableContext.Provider>
  );
};

export default MineSweeper;