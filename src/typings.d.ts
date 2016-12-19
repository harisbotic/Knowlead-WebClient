// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
declare var module: { id: string };
declare var require: any;
declare type DataReceived = (data: any) => void;
declare type ErrorHandler = (e: any) => void;
declare type ConnectionClosed = (e?: any) => void;
declare interface SimplePeerConfiguration {
  initiator: boolean,
  channelConfig?: any,
  channelName?: string,
  config?: any,
  constraints?: any,
  offerConstraints?: any,
  answerConstraints?: any,
  reconnectTimer?: boolean,
  sdpTransform?: (sdp: any) => any,
  stream?: MediaStream,
  trickle?: boolean,
  wrtc?: any
}

declare class SimplePeer {
    constructor(configuration: SimplePeerConfiguration);
    signal(sdp: any);
    send(data: any);
    destroy(onClose?: () => void);
    static WEBRTC_SUPPORT;
    on(eventName: string, callback: (data?:any) => void);
}