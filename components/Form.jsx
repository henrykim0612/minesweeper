import React, {useState, useCallback, useContext} from 'react';
import {TableContext} from "./MineSweeper";
import {START_GAME} from "./MineSweeper";

const Form = () => {

  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);
  const {dispatch} = useContext(TableContext);

  const onChangeRow = useCallback((e) => {
    setRow(e.target.value);
  }, []);

  const onChangeCell = useCallback((e) => {
    setCell(e.target.value);
  }, []);

  const onChangeMine = useCallback((e) => {
    setMine(e.target.value);
  }, []);

  const onClickButton = useCallback((e) => {
    dispatch({type: START_GAME, row, cell, mine});
  }, [row, cell, mine]);

  return (
    <div>
      <input type="number" onChange={onChangeRow} placeholder="Row size" value={row} />
      <input type="number" onChange={onChangeCell} placeholder="Cell size" value={cell} />
      <input type="number" onChange={onChangeMine} placeholder="Mine size" value={mine} />
      <button onClick={onClickButton}>START</button>
    </div>
  );
};

export default Form;