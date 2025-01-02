export const extractImageFromContent = (contentString) => {
  try {
    const contentObject = JSON.parse(contentString);

    const findImage = (node) => {
      if (!node || typeof node !== 'object') return null;

      if (node.type === 'image' && node.src) {
        return node.src;
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          const result = findImage(child);
          if (result) return result;
        }
      }

      return null;
    };

    return findImage(contentObject?.root) || null;
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return null;
  }
};
