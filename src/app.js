import angular from 'angular';
import './style/app.scss';
import 'angularjs-scroll-glue';
import templateTerminalCtrl from './components/terminal/terminal.html';
import TerminalCtrl from './components/terminal/terminal';
import socketFactory from './socket.factory';
import templateMainCtrl from './components/main/main.html';
import MainCtrl from './components/main/main';

export default angular.module('app', ['luegg.directives'])
  .component('main', {
    template: templateMainCtrl,
    controller: MainCtrl,
    controllerAs: 'app',
  })
  .component('terminal', {
    template: templateTerminalCtrl,
    controller: TerminalCtrl,
    controllerAs: 'app',
    bindings: {
      data: '<',
    },
  })
  .factory('Socket', socketFactory);
