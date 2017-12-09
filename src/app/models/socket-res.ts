export interface SUCCESS {
  success: boolean;
}

export interface ERROR extends SUCCESS {
  path: string;
  error: string | any;
}

export interface CONNECTED_FRIENDS extends SUCCESS {
  friends_status: {
    username: string;
    online: boolean;
    socket_id?: string
  }
}

export interface JOINED_ROOMS extends SUCCESS {
  rooms: [string] | null;
}

export interface CONNECTION_FRIEND extends SUCCESS {
  user: string;
  online: boolean;
}

export interface CONNECTION_GUEST extends SUCCESS {
  user: string;
  online: boolean;
}

export interface NEW_ROOM extends SUCCESS {
  room_id: string;
  guests?: [string];
}

export interface NEW_THREAD extends SUCCESS {
  thread_id: string;
}

export interface NEW_MESSAGE extends SUCCESS {
  thread_id: string;
  message: {
    thread: string;
    author: string;
    loadout: {
      media: string;
      content: string;
    }
  }
}

export interface SEND_FRIEND_REQUEST extends SUCCESS {
  requested: string;
}

export interface FRIEND_REQUEST extends SUCCESS {
  requester: string;
}

export interface RESPONSE_FRIEND_REQUEST extends SUCCESS {
  requested: string;
  accepted: boolean;
}

export interface REPLY_FRIEND_REQUEST extends SUCCESS {
  requested: string;
}

export interface REMOVE_FRIEND extends SUCCESS {
  unfriend: string;
}

export interface BLOCK_USER extends SUCCESS {
  blocked: string;
}

export interface ADD_GUEST extends SUCCESS {
  room_id: string;
  guest: string;
}

export interface ADDED_ROOM extends SUCCESS {
  room_id: string;
}

export interface JOIN_ROOM extends SUCCESS {
  room_id: string;
}

export interface LEFT_GUEST extends SUCCESS {
  guest: string;
}