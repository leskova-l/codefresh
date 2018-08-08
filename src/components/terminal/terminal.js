import './terminal.scss';

export default class TerminalCtrl {
  constructor() {
    this.terminal = {};
    this.timer = 0;
  }

  $onInit() {
    if (this.data) {
      this.terminal = this.data;
    }
  }
}
