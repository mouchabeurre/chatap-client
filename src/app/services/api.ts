import * as responses from '../models/socket-res';

interface Route {
  action: string;
  to: Subjects[];
}

export const routes: Route[] = [
  { action: 'connected-friends', to: [Subjects.sidelist] },
  { action: 'joined-rooms', to: [Subjects.sidelist] },
  { action: 'connection-friend', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'connection-guest', to: [Subjects.roomcontent] },
  { action: 'error-manager', to: [] },
  { action: 'create-room-ack', to: [Subjects.sidelist] },
  { action: 'rename-room-ack', to: [Subjects.sidelist, Subjects.roomcontent, Subjects.toolbar] },
  { action: 'get-room-ack', to: [Subjects.sidelist, Subjects.roomcontent, Subjects.toolbar] },
  { action: 'get-guests-ack', to: [Subjects.roomcontent] },
  { action: 'create-thread-ack', to: [Subjects.roomcontent] },
  { action: 'new-thread', to: [Subjects.roomcontent] },
  { action: 'thread-renamed', to: [Subjects.roomcontent] },
  { action: 'rename-thread-ack', to: [Subjects.roomcontent] },
  { action: 'delete-thread-ack', to: [Subjects.roomcontent] },
  { action: 'deleted-thread', to: [Subjects.roomcontent] },
  { action: 'get-thread-ack', to: [Subjects.roomcontent, Subjects.toolbar] },
  { action: 'get-stream-ack', to: [Subjects.roomcontent] },
  { action: 'send-thread-ack', to: [Subjects.roomcontent] },
  { action: 'new-message', to: [Subjects.roomcontent] },
  { action: 'send-friend-request-ack', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'friend-request', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'reply-friend-request-ack', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'response-friend-request', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'block-user-ack', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'remove-friend', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'add-guest-ack', to: [Subjects.toolbar] },
  { action: 'new-guest', to: [Subjects.roomcontent] },
  { action: 'added-room', to: [Subjects.sidelist, Subjects.toolbar] },
  { action: 'join-room-ack', to: [Subjects.sidelist] },
  { action: 'leave-room-ack', to: [Subjects.sidelist] },
  { action: 'remove-guest-ack', to: [Subjects.toolbar, Subjects.roomcontent] },
  { action: 'left-guest', to: [Subjects.toolbar, Subjects.roomcontent] },
  { action: 'search-user-ack', to: [Subjects.roomcontent] }
];

export const enum Subjects {
  sidelist = 0,
  roomcontent = 1,
  toolbar = 2
}