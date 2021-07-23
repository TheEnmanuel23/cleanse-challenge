function cleanse(originalData) {
  if (!originalData) {
    throw new Error(/Invalid data/);
  }

  const data = Array.isArray(originalData)
    ? [...originalData]
    : { ...originalData };

  const entries = Object.entries(data);
  entries.forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return delete data[key];
    }

    if (typeof value === "object") {
      return (data[key] = cleanse(value));
    }

    if (Array.isArray(data)) {
      data.forEach(cleanse);
    }
  });

  return data;
}

export default cleanse;
