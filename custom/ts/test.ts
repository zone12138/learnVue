/*
 * @Author: xie 1459547902@qq.com
 * @Date: 2025-06-24 13:29:55
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2025-07-02 11:15:50
 * @FilePath: \vue3-project\custom\ts\test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
type MyOmit<T, K extends keyof any> = { [P in MyExclude<keyof T, K>]: T[P] };

type MyExclude<T, U> = T extends U ? never : T;


interface ABC {
    name: string,
    age: number,
    sex: string
}

type OmitABC = MyOmit<ABC, 'name' | 'age'>; //