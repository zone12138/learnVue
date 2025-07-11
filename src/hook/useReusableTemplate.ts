/*
 * @Author: xie 1459547902@qq.com
 * @Date: 2025-07-03 09:26:21
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2025-07-03 10:00:09
 * @FilePath: \vue3-project\src\hook\useReusableTemplate.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export function useReusableTemplate() {
  let render: ((...args: any[]) => any) | undefined;
  const DefaultTemplate = {
    setup(
      _: any,
      { slots }: { slots: Record<string, (...args: any[]) => any> }
    ) {
      return () => {
        render = slots.default;
      };
    },
  };

  const UseTemplate = (props: object, a: any) => {
    console.log("UseTemplate props:", props, a);
    return render ? render(props) : null;
  };

  return [DefaultTemplate, UseTemplate];
}
