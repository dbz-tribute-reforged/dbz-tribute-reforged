import { Trigger } from 'w3ts';

export class FrameTrigger extends Trigger {
  constructor() {
    super();
  }

  public registerFrameEvent(frameHandle: framehandle, frameEvent: frameeventtype) {
    BlzTriggerRegisterFrameEvent(this.handle, frameHandle, frameEvent);
  }
}