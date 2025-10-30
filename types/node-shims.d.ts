/// <reference types="node" />

declare module './ai-ml-systems-architect';
declare module './ai-ml-systems-architect.js';
declare module './ai-ml-systems-architect.ts';

declare module 'events' {
  class EventEmitter {
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    emit(event: string | symbol, ...args: any[]): boolean;
  }
  export { EventEmitter };
}


