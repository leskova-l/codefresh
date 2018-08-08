export default class MainCtrl {
  constructor(Socket, $location, $anchorScroll) {
    this.socket = Socket;
    this.terminals = [];
    this.currentStep = {
      name: '',
      logs: [],
      timer: 0,
    };
    this.location = $location;
    this.scrollTo = $anchorScroll;

    this.listenSoket();
  }

  onBuild() {
    this.socket.emit('build', { msg: 'build' });
  }

  listenSoket() {
    this.socket.on('step', (data) => {
      if (this.currentStep.name !== data.name) {
        this.currentStep = {
          name: data.name,
          logs: [],
        };
        this.terminals.push(this.currentStep);
        this.scrollToTerminal(this.terminals.length);
      } else {
        this.currentStep.logs.push(data.log);
      }
    });
  }

  scrollToTerminal(i) {
    this.location.hash(`terminal${i}`);
    this.scrollTo();
  }
}
