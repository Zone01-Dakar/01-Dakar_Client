import Session from "./models/client_session.mjs";

let lolo = new Session();
await lolo.connect();
lolo
  .exec_query({
    type: "start",
    payload: {
      query:
        "\n  mutation insert_record ($objects: [record_insert_input!]!){\n    insert_record (objects: $objects) { returning { id } }\n  }".replace(
          /\n/g,
          ""
        ),
      variables: {
        objects: [
          {
            userId: 6600,
            authorId: 2545,
            typeName: "blocked-long",
            message: "test",
            startAt: "2024-09-25T20:41:10.885Z",
            endAt: null,
          },
        ],
      },
    },
  })
  .then((data) => console.log(data));
