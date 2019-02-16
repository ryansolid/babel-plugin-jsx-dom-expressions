const { createRuntime } = require('../../lib/runtime')
const r = createRuntime({})

describe("r.insert", () => {
  // <div>before<!-- insert -->after</div>
  const container = document.createElement("div");

  it("inserts nothing for null", () => {
    const res = insert(null);
    expect(res.innerHTML).toBe("");
    expect(res.childNodes.length).toBe(0);
  });

  it("inserts nothing for undefined", () => {
    const res = insert(undefined);
    expect(res.innerHTML).toBe("");
    expect(res.childNodes.length).toBe(0);
  });

  it("inserts nothing for false", () => {
    const res = insert(false);
    expect(res.innerHTML).toBe("");
    expect(res.childNodes.length).toBe(0);
  });

  it("inserts nothing for true", () => {
    const res = insert(true);
    expect(res.innerHTML).toBe("");
    expect(res.childNodes.length).toBe(0);
  });

  it("inserts nothing for null in array", () => {
    const res = insert(["a", null, "b"]);
    expect(res.innerHTML).toBe("ab");
    expect(res.childNodes.length).toBe(2);
  });

  it("inserts nothing for undefined in array", () => {
    const res = insert(["a", undefined, "b"]);
    expect(res.innerHTML).toBe("ab");
    expect(res.childNodes.length).toBe(2);
  });

  it("inserts nothing for false in array", () => {
    const res = insert(["a", false, "b"]);
    expect(res.innerHTML).toBe("ab");
    expect(res.childNodes.length).toBe(2);
  });

  it("inserts nothing for true in array", () => {
    const res = insert(["a", true, "b"]);
    expect(res.innerHTML).toBe("ab");
    expect(res.childNodes.length).toBe(2);
  });

  it("can insert strings", () => {
    const res = insert("foo");
    expect(res.innerHTML).toBe("foo");
    expect(res.childNodes.length).toBe(1);
  });

  it("can insert a node", () => {
    const node = document.createElement("span");
    node.textContent = "foo";
    expect(insert(node).innerHTML).toBe("<span>foo</span>");
  });

  it("can re-insert a node, thereby moving it", () => {
    const node = document.createElement("span");
    node.textContent = "foo";

    const first = insert(node),
      second = insert(node);

    expect(first.innerHTML).toBe("");
    expect(second.innerHTML).toBe("<span>foo</span>");
  });

  it("can insert an array of strings", () => {
    expect(insert(["foo", "bar"]).innerHTML).toBe("foobar", "array of strings");
  });

  it("can insert an array of nodes", () => {
    const nodes = [ document.createElement("span"), document.createElement("div")];
    nodes[0].textContent = "foo";
    nodes[1].textContent = "bar";
    expect(insert(nodes).innerHTML).toBe("<span>foo</span><div>bar</div>");
  });

  it("can insert a changing array of nodes", () => {
    var parent = document.createElement("div"),
      current = "",
      n1 = document.createElement("span"),
      n2 = document.createElement("div"),
      n3 = document.createElement("span"),
      n4 = document.createElement("div");
      orig = [n1, n2, n3, n4];

    n1.textContent = "1";
    n2.textContent = "2";
    n3.textContent = "3"
    n4.textContent = "4";

    var origExpected = expected(orig)

    // identity
    test([n1, n2, n3, n4]);

    // 1 missing
    test([    n2, n3, n4]);
    test([n1,     n3, n4]);
    test([n1, n2,     n4]);
    test([n1, n2, n3    ]);

    // 2 missing
    test([        n3, n4]);
    test([    n2,     n4]);
    test([    n2, n3    ]);
    test([n1,         n4]);
    test([n1,     n3    ]);
    test([n1, n2,       ]);

    // 3 missing
    test([n1            ]);
    test([    n2        ]);
    test([        n3    ]);
    test([            n4]);

    // all missing
    test([              ]);

    // swaps
    test([n2, n1, n3, n4]);
    test([n3, n2, n1, n4]);
    test([n4, n2, n3, n1]);

    // rotations
    test([n2, n3, n4, n1]);
    test([n3, n4, n1, n2]);
    test([n4, n1, n2, n3]);

    // reversal
    test([n4, n3, n2, n1]);

    function test(array) {
      current = r.insert(parent, array, current);
      expect(parent.innerHTML).toBe(expected(array));
      current = r.insert(parent, orig, current);
      expect(parent.innerHTML).toBe(origExpected);
    }

    function expected(array) {
      return array.map(n => n.outerHTML).join("");
    }
  });

  it("can insert nested arrays", () => {
    expect(insert(["foo", ["bar", "blech"]]).innerHTML)
    .toBe("foobarblech", "array of array of strings");
  });

  function insert(val) {
    const parent = container.cloneNode(true);
    r.insert(parent, val);
    return parent;
  }
});