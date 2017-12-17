import React from 'react';
import ReactDOM from 'react-dom';
import MainDisplay from './MainDisplay';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <div>
      <MainDisplay/>
    </div>,
    document.getElementById('mount')
  );
});
