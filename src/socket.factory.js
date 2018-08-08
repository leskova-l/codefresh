import config from './config';

export default function ($rootScope) {
  const socket = io.connect(`${config.host}:${config.port}`); // eslint-disable-line no-undef
  return {
    on(eventName, callback) {
      socket.on(eventName, function () {
        const args = arguments;  // eslint-disable-line
        $rootScope.$apply(() => {
          callback.apply(socket, args);
        });
      });
    },
    emit(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        const args = arguments;  // eslint-disable-line
        $rootScope.$apply(() => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
}
