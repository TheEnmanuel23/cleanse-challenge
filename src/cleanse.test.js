import cleanse from "./cleanse";

test("should be a function", () => {
  expect(typeof cleanse).toBe("function");
});

describe("validate errors or empty objects", () => {
  test("with no params", () => {
    expect(() => cleanse(null)).toThrow(/invalid/i);
  });

  test("sending null as parameter", () => {
    expect(() => cleanse(null)).toThrow(/invalid/i);
  });

  test("sending undefined as parameter", () => {
    expect(() => cleanse(null)).toThrow(/invalid/i);
  });
});

describe("validate a single level", () => {
  test("should delete null fields", () => {
    const result = cleanse({ name: "john", lastName: null });
    expect(result).toMatchObject({ name: "john" });
  });

  test("should delete undefined fields", () => {
    const result = cleanse({ name: "john", lastName: undefined });
    expect(result).toMatchObject({ name: "john" });
  });

  test("should keep empty string", () => {
    const result = cleanse({ name: "", lastName: undefined });
    expect(result).toMatchObject({ name: "" });
  });

  test("should keep values with 0", () => {
    const result = cleanse({ kilometers: 0, color: null });
    expect(result).toMatchObject({ kilometers: 0 });
  });

  test("should keep values with false", () => {
    const result = cleanse({ married: false, lastName: undefined });
    expect(result).toMatchObject({ married: false });
  });

  test("validate object without undefined or null values", () => {
    const data = { name: "john", lastName: "robison" };
    const result = cleanse(data);
    expect(result).toMatchObject(data);
  });
});

test("validate nested objects", () => {
  const data = {
    name: "name 1",
    lastName: null,
    child: {
      name: "name 2",
      address: "9800 Fredericksburg Road San Antonio, TX",
      lastName: undefined
    }
  };

  const result = cleanse(data);
  expect(result).toStrictEqual({
    name: "name 1",
    child: {
      name: "name 2",
      address: "9800 Fredericksburg Road San Antonio, TX"
    }
  });
});

describe("validate arrays", () => {
  test("send an array as main paramter", () => {
    const data = [
      {
        name: "name 1",
        lastName: null,
        child: {
          name: "name 2",
          address: "9800 Fredericksburg Road San Antonio, TX",
          lastName: undefined
        }
      }
    ];

    const result = cleanse(data);

    result.forEach((item) => {
      expect(item).toStrictEqual({
        name: "name 1",
        child: {
          name: "name 2",
          address: "9800 Fredericksburg Road San Antonio, TX"
        }
      });
    });
  });

  test("send an array as child item", () => {
    const data = {
      name: "name 1",
      lastName: null,
      children: [
        {
          name: "name 2",
          address: "9800 Fredericksburg Road San Antonio, TX",
          lastName: undefined
        }
      ]
    };

    const result = cleanse(data);

    expect(result).toStrictEqual({
      name: "name 1",
      children: [
        {
          name: "name 2",
          address: "9800 Fredericksburg Road San Antonio, TX"
        }
      ]
    });
  });

  test("send nested array", () => {
    const data = [
      {
        name: "name 1",
        lastName: null,
        children: [
          {
            name: "name 2",
            address: "9800 Fredericksburg Road San Antonio, TX",
            lastName: undefined
          }
        ]
      }
    ];

    const result = cleanse(data);

    result.forEach((item) => {
      expect(item).toStrictEqual({
        name: "name 1",
        children: [
          {
            name: "name 2",
            address: "9800 Fredericksburg Road San Antonio, TX"
          }
        ]
      });
    });
  });
});

describe("Validate immutable data", () => {
  test("validate original object, it should not change", () => {
    const originalData = {
      name: "name 1",
      lastName: null
    };

    const data = { ...originalData };

    const result = cleanse(data);
    expect(result).toStrictEqual({
      name: "name 1"
    });

    expect(data).toStrictEqual(originalData);
  });

  test("validate main array, it should not change", () => {
    const originalData = [
      {
        name: "name 1",
        lastName: null
      }
    ];

    const data = [...originalData];

    const result = cleanse(data);
    result.forEach((item, index) => {
      expect(item).toStrictEqual({
        name: "name 1"
      });
      expect(data[index]).toStrictEqual(originalData[index]);
    });
  });

  test("validate child array, it should not change", () => {
    const originalData = {
      name: "name 1",
      lastName: null,
      children: [
        {
          name: "name 2",
          lastName: undefined
        }
      ]
    };
    const data = { ...originalData };

    const result = cleanse(data);
    expect(result).toStrictEqual({
      name: "name 1",
      children: [
        {
          name: "name 2"
        }
      ]
    });
    expect(data).toStrictEqual(originalData);
  });

  test("validate nested array, it should not change", () => {
    const originalData = [
      {
        name: "name 1",
        lastName: null,
        children: [
          {
            name: "name 2",
            lastName: undefined
          }
        ]
      }
    ];

    const data = [...originalData];

    const result = cleanse(data);
    result.forEach((item, index) => {
      expect(item).toStrictEqual({
        name: "name 1",
        children: [
          {
            name: "name 2"
          }
        ]
      });

      expect(data[index]).toStrictEqual(originalData[index]);
    });
  });
});
