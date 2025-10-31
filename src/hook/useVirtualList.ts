/**
 * 虚拟列表
 * @description 用于处理大数据量列表的虚拟滚动，提高性能
 * @author xie
 * @version 1.0.0
 * @date 2025-10-24
 */
import { ref, onMounted, onBeforeUnmount, watch, nextTick, isRef } from "vue";
import type { Ref } from "vue";

/**
 * @typedef {Object} Config
 * @property {Array} data - 数据源
 * @property {string|import('vue').Ref} scrollContainer - 滚动容器的元素选择器
 * @property {string|import('vue').Ref} actualHeightContainer - 用于撑开高度的元素选择器
 * @property {string|import('vue').Ref} translateContainer - 用于偏移的元素选择器
 * @property {string|import('vue').Ref} itemContainer - 列表项选择器 TODO： 自动计算还需要调试和验证
 * @property {number} itemHeight - 列表项高度
 * @property {number} size - 每次渲染数据量
 * @property {number} [buffer] - 预渲染缓冲数量（每侧），可选
 */

type NullOrElement = HTMLElement | null;
type Selector = string | Ref<HTMLElement | null>;
type QueryContainer = ParentNode;

interface Config {
  data: Ref<any[]>; // 数据源
  parentContainer: Selector; // 父容器选择器（避免出现多个虚拟列表冲突）
  scrollContainer: Selector; // 滚动容器选择器
  actualHeightContainer: Selector; // 用于撑开高度的元素选择器
  translateContainer: Selector; // 用于偏移的元素选择器
  itemContainer?: string; // 列表项选择器
  itemHeight: number; // 列表项高度（预设）
  size: number; // 每次渲染数据量
  buffer?: number; // 预渲染缓冲数量，可选
}

/**
 * 虚拟列表
 * @param {Config} config 配置
 * @returns
 */
export function useVirtualList(config: Config) {
  // 获取元素
  let parentContainerEl: QueryContainer = document,
    actualHeightContainerEl: NullOrElement = null,
    translateContainerEl: NullOrElement = null,
    scrollContainerEl: NullOrElement = null;

  const {
    data,
    parentContainer,
    scrollContainer,
    actualHeightContainer,
    translateContainer,
    itemContainer,
    itemHeight,
    size,
    buffer,
  } = config;

  // 预渲染缓冲数量（overscan），默认取 size 的一半
  const bufferSize =
    typeof buffer === "number"
      ? Math.ceil(Math.max(0, buffer))
      : Math.ceil((size || 10) / 2);

  // 重置滚动条和偏移
  const resetScrollAndOffset = () => {
    if (!scrollContainerEl || !translateContainerEl) return;
    scrollContainerEl.scrollTop = 0;
    translateContainerEl.style.transform = "translateY(0px)";
  };

  let observer: IntersectionObserver | null = null;
  // 观察滚动容器是否进入视口
  const observeScrollContainer = () => {
    if (!scrollContainerEl) return;
    scrollContainerEl.style.overflow = "auto";
    const { height } = getComputedStyle(scrollContainerEl);
    // 如果滚动容器没设置高度（即height: 0px）时，会被其子容器撑开高度，无法正常滚动，需手动设置为 100%
    if (!height || height !== "0px") {
      scrollContainerEl.style.height = "100%";
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // 虚拟列表被隐藏时，无法直接通过 scrollContainerEl.scrollTop = 0 复位滚动条（需展示后再设置）
        if (entry.isIntersecting && dataIsChange) {
          // 元素进入视口且数据源已改变，复位滚动条和偏移
          resetScrollAndOffset();
          // 标记数据源已处理
          dataIsChange = false;
        }
      });
    });
    // 观察目标元素
    observer.observe(scrollContainerEl);
  };

  /**
   * 获取查询容器
   * @param {Selector} selector 选择器
   * @param {ParentNode} [defaultContainer] 默认容器
   * @returns 查询容器
   */
  const getQueryContainer = (
    selector: Selector,
    defaultContainer: QueryContainer = document
  ): QueryContainer => {
    let queryContainer: QueryContainer = defaultContainer;
    if (isRef(selector)) {
      queryContainer = selector.value ?? defaultContainer;
    } else if (typeof selector === "string") {
      queryContainer =
        defaultContainer.querySelector(selector) ?? defaultContainer;
    }
    return queryContainer;
  };

  /**
   * 获取 DOM 元素
   * @param {Selector} selector 选择器
   * @param {ParentNode} [parentContainer] 父容器
   * @param {NullOrElement} [defaultValue] 默认值
   * @returns DOM 元素
   */
  const getDomElement = (
    selector: Selector,
    parentContainer: QueryContainer = document,
    defaultValue: NullOrElement = null
  ): NullOrElement => {
    if (isRef(selector)) {
      return selector.value ?? defaultValue;
    } else if (typeof selector === "string") {
      return parentContainer.querySelector(selector) ?? defaultValue;
    }
    return defaultValue;
  };

  onMounted(() => {
    parentContainerEl = getQueryContainer(parentContainer, document);
    actualHeightContainerEl = getDomElement(
      actualHeightContainer,
      parentContainerEl
    );
    scrollContainerEl = getDomElement(scrollContainer, parentContainerEl);
    translateContainerEl = getDomElement(translateContainer, parentContainerEl);
    observeScrollContainer();
  });

  // 更新实际高度
  const updateActualHeight = () => {
    if (!actualHeightContainerEl) return;
    let actualHeight = 0;
    dataSource.forEach((_, i) => {
      actualHeight += getItemHeightFromCache(i);
    });
    actualHeightContainerEl.style.height = actualHeight + "px";
  };

  // TODO： 自动计算还需要调试和验证
  // 缓存已渲染元素的高度
  let RenderedItemsCache: Record<number, number> = {};
  // 更新已渲染列表项的缓存高度
  const updateRenderedItemCache = (index: number) => {
    // 当所有元素的实际高度更新完毕，就不需要重新计算高度
    const shouldUpdate =
      Object.keys(RenderedItemsCache).length < dataSource.length;
    if (!shouldUpdate) return;

    nextTick(() => {
      if (itemContainer) {
        // 获取所有列表项元素
        const Items = Array.from(
          parentContainerEl.querySelectorAll<HTMLElement>(itemContainer)
        );

        // 进行缓存
        Items.forEach((el) => {
          if (!RenderedItemsCache[index]) {
            RenderedItemsCache[index] = el.offsetHeight;
          }
          index++;
        });
        // console.log(RenderedItemsCache);
      }

      // 更新实际高度
      updateActualHeight();
    });
  };

  /**
   * 获取缓存高度，无缓存，取配置项的 itemHeight
   * @param {number} index 索引
   * @returns 高度
   */
  const getItemHeightFromCache = (index: number) => {
    const val = RenderedItemsCache[index];
    return val === void 0 ? itemHeight : val;
  };

  /**
   * 更新偏移值
   * @param {number} offset 偏移值
   */
  const updateOffset = (offset: number) => {
    if (!translateContainerEl) return;
    translateContainerEl.style.transform = `translateY(${offset}px)`;
  };

  // 实际渲染的数据
  const actualRenderData = ref<any[]>([]);

  /**
   * 更新实际渲染数据
   * @param {number} scrollTop 滚动Top值
   */
  const updateRenderData = (scrollTop: number) => {
    let startIndex = 0;
    let cumulative = 0;

    for (let i = 0; i < dataSource.length; i++) {
      cumulative += getItemHeightFromCache(i);
      if (cumulative >= scrollTop) {
        startIndex = i;
        break;
      }
    }

    // 计算渲染起止索引（包含缓冲）
    const renderStart = Math.max(0, startIndex - bufferSize);
    const renderEnd = Math.min(
      dataSource.length,
      startIndex + (config.size || 0) + bufferSize
    );

    // 渲染数据（包含缓冲）
    actualRenderData.value = dataSource.slice(renderStart, renderEnd);
    // 从缓冲起点开始更新已渲染项的高度缓存
    updateRenderedItemCache(renderStart);

    // 偏移量改为：缓冲起点之前的累计高度
    let offsetBeforeRenderStart = 0;
    for (let i = 0; i < renderStart; i++) {
      offsetBeforeRenderStart += getItemHeightFromCache(i);
    }
    updateOffset(offsetBeforeRenderStart);
  };

  // 数据源，便于后续直接访问
  let dataSource: any[] = [],
    dataIsChange = false;
  // 数据源发生变动
  watch(
    () => data.value,
    (newVal) => {
      // 更新数据源
      dataSource = newVal;
      // 标记数据源已改变
      dataIsChange = true;
      // 清空已渲染项的高度缓存
      RenderedItemsCache = {};
      // 计算需要渲染的数据
      updateRenderData(0);
      resetScrollAndOffset();
    },
    {
      deep: true,
      immediate: true,
    }
  );

  /**
   * 滚动事件处理
   * @param {Event} e 事件对象
   */
  const handleScroll = (e: Event) => {
    // 当数据量小于等于 size 时，无需虚拟滚动
    if (dataSource.length <= size) return;
    // 渲染正确的数据
    updateRenderData((e.target as HTMLElement).scrollTop);
  };

  // 注册滚动事件
  onMounted(() => {
    scrollContainerEl?.addEventListener("scroll", handleScroll, {
      passive: true,
    });
  });
  // 移除滚动事件
  onBeforeUnmount(() => {
    scrollContainerEl?.removeEventListener("scroll", handleScroll);
    // 移除滚动容器的观察
    observer?.disconnect();
  });

  return { actualRenderData };
}
