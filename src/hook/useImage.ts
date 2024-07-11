import { ref } from "vue";
import path from "path";
export function useImage() {
  const allImage = ref<string[]>([]);

  interface ImageCollection {
    [key: string]: any; // 字符串键对应字符串值，例如图片路径
  }
  const imageCollection: ImageCollection = require.context(
    "../assets/images/",
    false,
    /\.(png|jpg|jpeg|gif|webp|ico)$/
  );

  imageCollection.keys().forEach((key: string) => {
    const name = path.basename(key);
    console.log(imageCollection[key]);
    allImage.value.push(`@/assets/images/${name}`);
  });

  const getRandomImage = () => {
    return allImage.value[Math.floor(Math.random() * allImage.value.length)];
  };

  const getImage = (count: number) => {
    return allImage.value.slice(0, count);
  };

  return {
    allImage,
    getRandomImage,
    getImage,
  };
}
