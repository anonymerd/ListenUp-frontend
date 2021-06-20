import React, { Component } from 'react';
import './Options.css';
const Options = (props) => {
  return (
    <button onClick={props.func} className='option-buttons' value={props.value}>
      {props.value}
    </button>
  );
};

export default Options;
