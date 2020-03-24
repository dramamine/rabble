type ClientConfig = {
  game: Object;
  board: Object;
  multiplayer: Object;
};

type SocketConfig = {
  server: string;
};

type ServerConfig = {
  games: [Any];
};

declare module "boardgame.io/react" {
  export function Client(config: ClientConfig): Any;
}

declare module "boardgame.io/multiplayer" {
  export function Local(): Any;
  export function SocketIO(config: SocketConfig): Any;
}

declare module "boardgame.io/server" {
  export function Server(config: ServerConfig): Any;
}