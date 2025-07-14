const allImage: string[] = [];
const imageCollection = import.meta.glob<string>("../assets/images/*.{png,jpg}", { eager: true, import: 'default' });

// 处理立即加载模式（直接获取路径）
for (const path in imageCollection) {
  allImage.push(imageCollection[path]);
}

export function useImage() {
  const getRandomImage = () => {
    return allImage[Math.floor(Math.random() * allImage.length)];
  };

  const getImage = (count: number) => {
    return allImage.slice(0, count);
  };

  return {
    allImage,
    getRandomImage,
    getImage,
  };
}
