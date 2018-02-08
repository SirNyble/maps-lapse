import React from 'react';
import ReactDOM from 'react-dom';
import MainDisplay from './MainDisplay';
import StreetViewComponent from './StreetViewComponent';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <div>
      <StreetViewComponent/>
    </div>,
    document.getElementById('mount')
  );
});
