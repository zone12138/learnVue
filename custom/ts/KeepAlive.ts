function ref<T>(value: T): Ref<UnwrapRef<T>>

interface Ref<T> {
  value: T
}

// 规范化签名 (3.3+)
function toRef<T>(
  value: T
): T extends () => infer R
  ? Readonly<Ref<R>>
  : T extends Ref
  ? T
  : Ref<UnwrapRef<T>>;

// 对象属性签名
function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]>;

type ToRef<T> = T extends Ref ? T : Ref<T>;
