import EventEmitter from "events";
import WebSocket from "ws";

class Session {
  constructor() {
    this.open = false;
    const url = "wss://learn.zone01dakar.sn/api/graphql-engine/v1/graphql";
    this.event_query_mapper = {};
    // TODO: complete this class
    this.ws = new WebSocket(url, "graphql-ws", {
      headers: {
        Host: "learn.zone01dakar.sn",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Sec-WebSocket-Version": "13",
        Origin: "https://learn.zone01dakar.sn",
        "Sec-WebSocket-Extensions": "permessage-deflate",
        Connection: "keep-alive, Upgrade",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "websocket",
        "Sec-Fetch-Site": "same-origin",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Upgrade: "websocket",
      },
    });
  }
  connect() {
    return new Promise((resolve) => {
      this.ws.on("open", () => {
        this.open = true;
        this.ws.send(
          JSON.stringify({
            type: "connection_init",
            payload: {
              headers: {
                Authorization: "Bearer " + process.env.CLIENT_TOKEN,
                "x-hasura-role": "admin",
              },
            },
          })
        );
        this.ws.on("message", (message) => {
          let response = JSON.parse(message);
          let id = response.id;

          let event = this.event_query_mapper[id];

          if (event) {
            event.emit("data", response);
            delete this.event_query_mapper[id];
          }
        });
        resolve();
      });
    });
  }
  exec_query(query) {
    let id = nanoid();
    let event = new EventEmitter();
    let the_promise = new Promise((resolve) =>
      event.on("data", async (data) => resolve(data))
    );
    query.id = id;
    this.event_query_mapper[id] = event;
    this.ws.send(JSON.stringify(query));
    return the_promise;
  }

}

let urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 11) {
  let id = "";
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
}

export default Session;
