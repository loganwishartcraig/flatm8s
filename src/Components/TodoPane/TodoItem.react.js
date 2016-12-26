import React, { Component } from 'react';
import { TodoACtions } from '../../Actions/TodoActions' 

// const _handleButtonClick = (e) => {
//   TodoActions.
// }

export const TodoItem = ({
  todo,
  toggleHandler
}) => (
  <li><b><button onClick={e => {toggleHandler(todo.id)}}>Got it</button>{todo.dateRequested.toString()}</b> - {todo.text} - <i>{todo.requestedBy}</i></li>
)