import { watch, onActivated, onDeactivated, ref, shallowRef } from 'vue';
import { cloneDeep, isEqual } from 'lodash';

/**
 * 模拟 Vue3 keep-alive 缓存期间 props 变化延迟触发 watch 的效果
 * @param source 要监听的数据源（如 props.data）
 * @param callback 数据变化时的回调函数
 * @param options 监听配置（支持 deep）
 */
export function useDelayedWatch<T>(
  source: T,
  callback: (newVal: T) => void,
  options: { deep?: boolean } = {}
) {
  const isActive = ref(true);
  const cachedValue = shallowRef<T | null>(null);

  // 监听数据源变化
  watch(
    () => source,
    (newVal) => {
      if (isActive.value) {
        // 激活状态：直接触发回调
        callback(newVal);
      } else {
        // 缓存状态：暂存变化（深拷贝避免引用污染）
        cachedValue.value = cloneDeep(newVal);
      }
    },
    { deep: options.deep ?? true } // 默认深监听
  );

  // 组件激活时检查缓存
  onActivated(() => {
    isActive.value = true;
    if (cachedValue.value !== null && !isEqual(cachedValue.value, source)) {
      callback(cloneDeep(source)); // 触发回调（使用当前最新值）
      cachedValue.value = null; // 清空缓存
    }
  });

  // 组件失活时标记状态
  onDeactivated(() => {
    isActive.value = false;
  });
}