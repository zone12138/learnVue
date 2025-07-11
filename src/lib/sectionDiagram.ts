const OBJECT_ID_ATTRS = ["ObjectId", "objectId", "ObjectID"]; // cimId属性【兼容多种属性】
const STATUS_ATTR = "xlink:href"; // 状态属性
let svgRoot: Element | null; // svg图根节点
let svgName = ""; // gis图路径

/**
 * 获取远端文件
 * @param {Array} paths 路径数组
 * @returns {Promise<string>} 返回解析后的文本内容
 * @description 按顺序请求路径数组中的每个路径，直到成功获取到SVG图文件为止
 */
const fetchDocument = async (paths: string[]) => {
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        // 可根据需要返回相应数据，如 response.json()
        return response.text();
      }
    } catch (error) {
      // 请求失败（如网络错误），继续下一个路径
      continue;
    }
  }
  throw new Error("新旧目录均无对应的SVG图文件！");
};

/**
 * 下载断面数据
 * @param {Array} paths
 * @param {Array} data
 * @param {String} svgName
 * @returns {Promise}
 */
const downloadSectionDiagram = async (
  paths: string[],
  data = [],
  name = "gis.svg"
) => {
  try {
    const text = await fetchDocument(paths);
    const parser = new DOMParser();
    svgRoot = parser.parseFromString(text, "image/svg+xml").documentElement;

    svgName = name;
    data.forEach(({ code, yxv }) => {
      const dom = findDomByCimId(code);
      if (!dom) {
        console.log("缺失的dom：", code);
        return;
      }
      setDeviceStatus(dom, yxv);
    });

    downloadSVGFile();

    svgRoot = null; // 清空svg图根节点
    svgName = ""; // 清空gis图路径
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * 根据设备id查找dom（useDom）
 * @param {String} id 设备id
 * @returns useDom
 */
const findDomByCimId = (id: string) => {
  // 采用结尾匹配，因为svg图中的设备id带了前缀
  let dom = OBJECT_ID_ATTRS.map(
    (attr) => svgRoot && svgRoot.querySelector(`[${attr}$="${id}"]`)
  ).find((dom) => dom);
  while (dom && dom.tagName !== "g") {
    dom = dom.parentElement;
  }
  return dom && dom.querySelector("use");
};

/**
 * 设置设备状态
 * @param {Element} useNode useDom
 * @param {Number} status 设备状态
 * @returns
 */
const setDeviceStatus = (useNode: SVGUseElement, status: number) => {
  const xlink_href = useNode.getAttribute(STATUS_ATTR);
  if (!xlink_href) return;
  const { lastIndex } = findLastPointIndex(xlink_href);
  if (lastIndex === -1) return;
  const newHref = xlink_href.substring(0, lastIndex + 1) + status;
  useNode.setAttribute(STATUS_ATTR, newHref);
};

/**
 * 查找字符串中最后一个点的位置
 * @param {String} str 字符串
 * @returns
 */
const findLastPointIndex = (str: string) => {
  const lastIndex = str.lastIndexOf("@");
  return {
    lastIndex,
    preStatus: lastIndex > -1 ? str.substring(lastIndex + 1) : "",
  };
};

/**
 * 下载svg图
 */
const downloadSVGFile = () => {
  if (!svgRoot) return;
  const blob = new Blob([svgRoot.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = svgName;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url); // 释放对象URL
};

export { downloadSectionDiagram };
