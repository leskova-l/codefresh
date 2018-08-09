import config from './config';

export default function ($rootScope) {
  const socket = io.connect(`${config.host}:${config.port}`); // eslint-disable-line no-undef
  return {
    on(eventName, callback) {
      socket.on(eventName, (...args) => {
        $rootScope.$apply(() => {
          callback.apply(socket, args);
        });
      });
    },
    emit(eventName, data, callback) {
      socket.emit(eventName, data, (...args) => {
        $rootScope.$apply(() => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
}
