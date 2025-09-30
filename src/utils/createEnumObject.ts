/**
 * 接收一个只读对象 (用 as const 定义)，
 * 返回一个“类枚举”对象，其每个属性的值都等于其属性的键名。
 * * @param obj - 一个使用 "as const" 断言的常量对象。
 * @returns 一个新的对象，用于在代码中安全地引用原始对象的键。
 */
export default function createEnumObject<T extends Readonly<Record<string, any>>>(obj: T) {
    const enumObject: { [K in keyof T]: K } = {} as any;
  
    for (const key of Object.keys(obj) as Array<keyof T>) {
      enumObject[key] = key;
    }
  
    return enumObject;
  }