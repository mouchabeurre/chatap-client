export interface MESSAGE {
  id: string;
  thread: string;
  loadout: {
    media: ['link', 'image', 'text'];
    content: string;
  };
  author: string;
  date: Date;
}