import 'babel-polyfill';

import React from 'react';
import reactA11y from 'react-a11y';
import ReactDOM from 'react-dom';
import Terminal from 'web-ssh/client'; // eslint-disable-line import/no-extraneous-dependencies import/no-unresolved


reactA11y(React);


ReactDOM.render((
  <div style={{ maxWidth: '800px', margin: '20px auto' }}>
    <Terminal gateway="ws://localhost:5000" />
  </div>
  ), document.getElementById('root'));
