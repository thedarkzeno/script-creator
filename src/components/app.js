import { h } from "preact";
import { useState } from "preact/hooks";
import { Flowpoint, Flowspace } from "flowpoints";
import "../style/index.css";

export default function SimpleDiagramWidget() {
  const [nodes, setNodes] = useState([]);
  const [preLink, setPreLink] = useState(null);
  const [SelectedIndex, setIndex] = useState(null);
  const [Input, setInput] = useState(JSON.stringify(nodes));
  const addNode = () => {
    const node = {
      id: nodes.length.toString(),
      posX: 0,
      posY: 0,
      selected: false,
      text: "Opção de pergunta!?",
      answer: "Resposta",
      outputs: [],
      abstractVariable: false,
      variableName: "",
    };
    if (nodes.length == 0) {
      node.text = "";
      node.answer = "";
    }
    setNodes((prevState) => [...prevState, node]);
    return node;
  };
  const setLink = (index) => {
    if (preLink == null) {
      setPreLink(index);
    } else if (preLink == index) {
      setPreLink(null);
    } else {
      setNodes((prev) => {
        let items = prev;
        items[preLink].outputs.push(nodes[index].id);
        return [...items];
      });
      setPreLink(null);
    }
  };
  const handleSelect = (index) => {
    if (index !== 0) {
      setNodes((prev) => {
        let items = prev;
        console.log(items);
        let lastI = items.findIndex((element) => element.selected == true);
        console.log(lastI);
        if (lastI > -1) {
          items[lastI].selected = false;
        }

        items[index].selected = true;
        setIndex(index);

        return [...items];
      });
    }
  };
  const handleText = (text) => {
    setNodes((prev) => {
      let items = prev;
      items[SelectedIndex].text = text;
      return [...items];
    });
  };
  const handleAnswer = (text) => {
    setNodes((prev) => {
      let items = prev;
      items[SelectedIndex].answer = text;
      return [...items];
    });
  };
  const undoConnections = () => {
    setNodes((prev) => {
      let items = prev;
      items[SelectedIndex].outputs = [];
      return [...items];
    });
  };
  const handleLoad = () => {
    setNodes(JSON.parse(Input));
    setIndex(null);
    setPreLink(null);
  };
  const handleInput = (msg) => {
    setInput(msg);
  };
  return (
    <div>
      <button onClick={addNode}>Add node</button>
      <div style={{ display: "flex" }}>
        <Flowspace
          style={{ width: "80vw", height: "500px", marginRight: "10px" }}
          avoidCollisions
          arrowEnd={true}
        >
          {nodes.map((node, i) => {
            return (
              <Flowpoint
                variant="outlined"
                theme={node.selected ? "red" : "blue"}
                snap={{ x: 10, y: 10 }}
                style={{
                  height: Math.max(
                    50,
                    Math.ceil((node.text + node.answer).length / 20) * 30 + 100
                  ),
                }}
                key={node.id}
                startPosition={{ x: node.posX, y: node.posY }}
                outputs={node.outputs}
                onClick={() => handleSelect(i)}
                onDrag={(position) => {
                  setNodes((prev) => {
                    let items = prev;
                    items[i].posX = position.x;
                    items[i].posY = position.y;
                    return [...items];
                  });
                }}
              >
                {node.id !== "0" ? (
                  <>
                    <b>Pergunta:</b>
                    <br />
                    <i>{node.text}</i>
                    <hr />
                    <br />
                    <b>Resposta:</b>
                    <br />
                    <i>{node.answer}</i>
                    <br />
                    <button
                      onClick={() => {
                        setLink(i);
                      }}
                    >
                      link node
                    </button>
                  </>
                ) : (
                  <>
                    Initial Node
                    <br />
                    <button
                      onClick={() => {
                        setLink(i);
                      }}
                    >
                      link node
                    </button>
                  </>
                )}
              </Flowpoint>
            );
          })}
        </Flowspace>
        <div id="sidebar" style={{}}>
          Edit Node:
          <br />
          {SelectedIndex != null ? (
            <>
              <textarea
                onChange={(e) => handleText(e.target.value)}
                value={nodes[SelectedIndex].text}
              />
              <br />
              <textarea
                onChange={(e) => handleAnswer(e.target.value)}
                value={nodes[SelectedIndex].answer}
              />
              <br />
              Abstract variable?{" "}
              <input
                id="abstract"
                type="checkbox"
                checked={nodes[SelectedIndex].abstractVariable}
                onChange={(e) => {
                  setNodes((prev) => {
                    let items = prev;
                    items[SelectedIndex].abstractVariable = e.target.checked;
                    return [...items];
                  });
                }}
              />
              <br />
              <input
                id="abstract"
                type="text"
                value={nodes[SelectedIndex].variableName}
                onChange={(e) => {
                  setNodes((prev) => {
                    let items = prev;
                    items[SelectedIndex].variableName = e.target.value;
                    return [...items];
                  });
                }}
              />
              <br />
              <button onClick={undoConnections}>Undo Connections</button>
            </>
          ) : null}
          <br />
          <p>Result:</p>
          <textarea
            style={{ minWidth: "100%", minHeight: "200px" }}
            value={JSON.stringify(nodes)}
            disabled
          />
        </div>
      </div>
      <div id="json">
        <textarea
          style={{ minWidth: "100%", minHeight: "200px" }}
          onChange={(e) => handleInput(e.target.value)}
        />
        <button onClick={handleLoad}>Load</button>
      </div>
    </div>
  );
}
