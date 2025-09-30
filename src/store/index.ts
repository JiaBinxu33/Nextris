// src/stores/index.ts
import { createContext, useContext } from 'react';
import { MatrixStore } from './MatrixStore';

// 创建一个 MatrixStore 的实例
export const matrixStore = new MatrixStore();

// 创建一个 React Context，用来在组件之间传递这个 store
export const StoreContext = createContext(matrixStore);

// 创建一个自定义 Hook，让组件可以方便地使用 store
export const useStore = () => useContext(StoreContext);