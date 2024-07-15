/*
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-15 11:15:30
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-15 11:23:38
 * @FilePath: \vue3-project\src\event\EventEmitter.ts
 * @Description: 手写 $on $off $emit $once
 */
class EventEmitter {
  events: {
    [eventName: string]: Function[];
  };
  constructor() {
    this.events = {};
  }
  /**
   * 绑定事件
   * @param eventName 事件名称
   * @param fn 函数
   */
  $on(eventName: string, fn: Function) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  /**
   * 解绑事件
   * @param eventName 事件名称
   * @param fn 函数
   */
  $off(eventName: string, fn?: Function) {
    if (!this.events[eventName]) return;
    if (!fn) {
      this.events[eventName] = [];
    } else {
      this.events[eventName] = this.events[eventName].filter(f => f !== fn);
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 参数
   */
  $emit(eventName: string, ...args: any[]) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(fn => fn.apply(this,...args));
  }

  /**
   * 触发事件一次
   * @param eventName 事件名称
   * @param fn 函数
   */
  $once(eventName: string, fn: Function) {
    const _fn = (...args: any[]) => {
      fn.apply(this, args);
      this.$off(eventName, _fn);
    };
    this.$on(eventName, _fn);
  }
}
