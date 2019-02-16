const { createRuntime } = require('../../lib/runtime')
const r = createRuntime({})

describe("r.insert with Markers", () => {
  // <div>before<!-- insert -->after</div>
  var container = document.createElement("div");
  container.appendChild(document.createTextNode("before"));
  container.appendChild(document.createTextNode(""));
  container.appendChild(document.createTextNode("after"));

  it("inserts nothing for null", () => {
    const res = insert(null);
    expect(res.innerHTML).toBe("beforeafter");
    expect(res.childNodes.length).toBe(3);
  });

  it("inserts nothing for undefined", () => {
    const res = insert(undefined);
    expect(res.innerHTML).toBe("beforeafter");
    expect(res.childNodes.length).toBe(3);
  });

  it("inserts nothing for false", () => {
    const res = insert(false);
    expect(res.innerHTML).toBe("beforeafter");
    expect(res.childNodes.length).toBe(3);
  });

  it("inserts nothing for true", () => {
    const res = insert(true);
    expect(res.innerHTML).toBe("beforeafter");
    expect(res.childNodes.length).toBe(3);
  });

  it("inserts nothing for null in array", () => {
    const res = insert(["a", null, "b"]);
    expect(res.innerHTML).toBe("beforeabafter");
    expect(res.childNodes.length).toBe(5);
  });

  it("inserts nothing for undefined in array", () => {
    const res = insert(["a", undefined, "b"]);
    expect(res.innerHTML).toBe("beforeabafter");
    expect(res.childNodes.length).toBe(5);
  });

  it("inserts nothing for false in array", () => {
    const res = insert(["a", false, "b"]);
    expect(res.innerHTML).toBe("beforeabafter");
    expect(res.childNodes.length).toBe(5);
  });

  it("inserts nothing for true in array", () => {
    const res = insert(["a", true, "b"]);
    expect(res.innerHTML).toBe("beforeabafter");
    expect(res.childNodes.length).toBe(5);
  });

  it("can insert strings", () => {
    const res = insert("foo");
    expect(res.innerHTML).toBe("beforefooafter");
    expect(res.childNodes.length).toBe(4);
  });

  it("can insert a node", () => {
    const node = document.createElement("span");
    node.textContent = "foo";
    expect(insert(node).innerHTML).toBe("before<span>foo</span>after");
  });

  it("can re-insert a node, thereby moving it", () => {
    var node = document.createElement("span");
    node.textContent = "foo";

    const first = insert(node),
      second = insert(node);

    expect(first.innerHTML).toBe("beforeafter");
    expect(second.innerHTML).toBe("before<span>foo</span>after");
  });

  it("can insert an array of strings", () => {
    expect(insert(["foo", "bar"]).innerHTML)
      .toBe("beforefoobarafter", "array of strings");
  });

  it("can insert an array of nodes", () => {
    const nodes = [ document.createElement("span"), document.createElement("div")];
    nodes[0].textContent = "foo";
    nodes[1].textContent = "bar";
    expect(insert(nodes).innerHTML).toBe("before<span>foo</span><div>bar</div>after");
  });

  it("can insert a changing array of nodes", () => {
    let container = document.createElement("div"),
      marker = container.appendChild(document.createTextNode("")),
      span1 = document.createElement("span"),
      div2 = document.createElement("div"),
      span3 = document.createElement("span"),
      current;
    span1.textContent = "1";
    div2.textContent = "2";
    span3.textContent = "3"

    current = r.insert(container, [], current, marker);
    expect(container.innerHTML).toBe("");

    current = r.insert(container, [span1, div2, span3], current, marker);
    expect(container.innerHTML)
      .toBe("<span>1</span><div>2</div><span>3</span>");

    current = r.insert(container, [div2, span3], current, marker);
    expect(container.innerHTML)
      .toBe("<div>2</div><span>3</span>");

    current = r.insert(container, [div2, span3], current, marker);
    expect(container.innerHTML)
      .toBe("<div>2</div><span>3</span>");

    current = r.insert(container, [span3, div2], current, marker);
    expect(container.innerHTML)
      .toBe("<span>3</span><div>2</div>");

    current = r.insert(container, [], current, marker);
    expect(container.innerHTML)
      .toBe("");

    current = r.insert(container, [span3], current, marker);
    expect(container.innerHTML)
      .toBe("<span>3</span>");

    current = r.insert(container, [div2], current, marker);
    expect(container.innerHTML)
      .toBe("<div>2</div>");
  });

  it("can insert nested arrays", () => {
    expect(insert(["foo", ["bar", "blech"]]).innerHTML)
      .toBe("beforefoobarblechafter", "array of array of strings");
  });

  function insert(val) {
    const parent = container.cloneNode(true);
    r.insert(parent, val, undefined, parent.childNodes[1]);
    return parent;
  }
});