import React from 'react';


const terminalOutputStyles = {
  backgroundColor: '#555',
  fontFamily: 'monospace',
  fontSize: '13px',
  height: '400px',
};

export default class TerminalOutput extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
        className="web-ssh-terminal-output"
        ref={(c) => { this.domNode = c; }}
        style={terminalOutputStyles}
      />
    );
  }
}
