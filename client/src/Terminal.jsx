import React from 'react';
import Term from 'term.js/src/term'; // eslint-disable-line import/no-extraneous-dependencies

import TerminalOutput from './TerminalOutput';

export default class Terminal extends React.Component {

  static defaultProps = {
    pixelsPerColumn: 8,
    pixelsPerRow: 14.8,
  };

  static propTypes = {
    gateway: React.PropTypes.string.isRequired,
    pixelsPerColumn: React.PropTypes.number.isRequired,
    pixelsPerRow: React.PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.socket = null;
    this.termjsTerm = null;

    this.onResize = this.onResize.bind(this);
  }

  state = {
    error: null,
    socketConnected: false,
    sshConnected: false,
  };

  componentDidMount() {
    this.connect();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.disconnect();
  }

  onSocketOpen() {
    console.log('socket opened');
    this.termjsTerm.open(this.outputComponent.domNode);
    this.setState({
      socketConnected: true,
      sshConnected: true,
    });
  }

  onSocketClose() {
    console.warn('Socket closed');
    this.setState({
      socketConnected: false,
      sshConnected: false,
    });
  }

  onSocketError(err) {
    console.warn('Socket error');
    console.warn(err);
    this.setState({
      error: err,
    });
  }

  onSocketMessage(e) {
    console.log(e.data);
    const data = e.data;
    switch (data.charAt(0)) {
      case 's':
        this.onSshStatus(data.slice(2));
        break;
      case 'o':
        this.termjsTerm.write(data.slice(2));
        break;
      default:
        console.warn(`Unexpected message type: ${data.charAt(0)}`);
    }
  }

  onSshStatus(status) {
    console.log(`SSH Status: ${status}`);
    if (status === 'connected') {
      const dims = this.measureOutputContainer();
      this.socket.send(JSON.stringify({ r: dims }));
      this.termjsTerm.resize(dims.c, dims.r);
    }
  }

  onResize() {
    const dims = this.measureOutputContainer();
    this.termjsTerm.resize(dims.c, dims.r);
    this.socket.send(JSON.stringify({ r: dims }));
  }

  onTermData(data) {
    this.socket.send(JSON.stringify({ i: data }));
  }

  connect() {
    if (this.socket) {
      this.socket.close();
    }

    if (this.termjsTerm) {
      this.termjsTerm.destroy();
    }
    const dims = this.measureOutputContainer();
    this.termjsTerm = new Term({
      cols: dims.c,
      rows: dims.r,
      screenKeys: true,
    });

    this.setState({
      error: null,
    });

    this.socket = new WebSocket(this.props.gateway);
    this.socket.onopen = this.onSocketOpen.bind(this);
    this.socket.onclose = this.onSocketClose.bind(this);
    this.socket.onerror = this.onSocketError.bind(this);
    this.socket.onmessage = this.onSocketMessage.bind(this);

    this.termjsTerm.on('data', this.onTermData.bind(this));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.termjsTerm) {
      this.termjsTerm.destroy();
    }
  }

  measureOutputContainer() {
    const containerNode = this.outputComponent.domNode;
    const s = window.getComputedStyle(containerNode);

    const height = containerNode.clientHeight
      - parseFloat(s.paddingTop)
      - parseFloat(s.paddingBottom)
      - parseFloat(s.borderTopWidth)
      - parseFloat(s.borderBottomWidth);
    const width = containerNode.clientWidth
      - parseFloat(s.paddingLeft)
      - parseFloat(s.paddingRight)
      - parseFloat(s.borderLeftWidth)
      - parseFloat(s.borderRightWidth);

    return {
      h: height,
      w: width,
      r: Math.floor(height / this.props.pixelsPerRow),
      c: Math.floor(width / this.props.pixelsPerColumn),
    };
  }

  render() {
    return (
      <div className="web-ssh-terminal">
        <TerminalOutput
          ref={(c) => { this.outputComponent = c; }}
          style={{ height: '500px' }}
        />
      </div>
    );
  }

}
