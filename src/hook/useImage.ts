const allImage: string[] = [];

// @ts-ignore
const imageCollection = import.meta.glob("../assets/images/*.{png,jpg}", { eager: true });

console.log(imageCollection)

// 处理立即加载模式（直接获取路径）
for (const path in imageCollection) {
  allImage.push(imageCollection[path].default);
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
