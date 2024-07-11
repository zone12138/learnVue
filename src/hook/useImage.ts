const allImage: string[] = [];

const imageCollection = require.context(
  "../assets/images/",
  false,
  /\.(png|jpg|jpeg|gif|webp|ico)$/
);

imageCollection.keys().forEach((key: string) => {
  allImage.push(imageCollection(key));
});
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
