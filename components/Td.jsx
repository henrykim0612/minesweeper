import React, {useCallback, useContext, memo} from 'react';
import {CLICK_MINE, CODE, FLAG_CELL, NORMALIZE_CELL, OPEN_CELL, QUESTION_CELL, TableContext} from "./MineSweeper";

const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return 'is-dark';
    case CODE.OPENED:
    case CODE.CLICKED_MINE:
      return 'is-white';
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return 'is-yellow';
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return 'is-red';
    default:
      return 'is-white';
  }
};

const getTdText = (code) => {
  console.log('getTdText');
  switch (code) {
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return 'X';
    case CODE.CLICKED_MINE:
      return '펑';
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return '!';
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return '?';
    default:
      return code || '';
  }
}

const Td = memo(({rowIndex, cellIndex}) => {

  const {tableData, dispatch, halted} = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if (halted) return; // Game over 라면 중지
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG:
      case CODE.FLAG_MINE:
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        return;
      case CODE.NORMAL: {
        dispatch({type: OPEN_CELL, row: rowIndex, cell: cellIndex});
        return;
      }
      case CODE.MINE: {
        dispatch({type: CLICK_MINE, row: rowIndex, cell: cellIndex});
        return;
      }
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  // 오른쪽 클릭
  const onCxtMenu = useCallback( (e) => {
    e.preventDefault(); // 기본 메뉴는 안뜨게
    if (halted) return; // Game over 라면 중지
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.NORMAL:
      case CODE.MINE:
        dispatch({type: FLAG_CELL, row: rowIndex, cell: cellIndex});
        return;
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        dispatch({type: QUESTION_CELL, row: rowIndex, cell: cellIndex});
        return;
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        dispatch({type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex});
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  console.log('Rendered TD..(TD함수는 여러번 실행되지만 useMemo로 getTdText는 한번만 실행되므로 최적화가 된 것. 함수가 여러번 실행되는거는 어쩔수 없음.');
  return <RealTd onClickTd={onClickTd} onCxtMenu={onCxtMenu} data={tableData[rowIndex][cellIndex]} />;
});

const RealTd = memo(({ onClickTd, onCxtMenu, data}) => {
  console.log('real td rendered');
  return (
    <td style={getTdStyle(data)} onClick={onClickTd} onContextMenu={onCxtMenu}>{getTdText(data)}</td>
  )
});

export default Td;