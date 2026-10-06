/// <reference types="vite/client" />

declare interface ImportMeta {
  glob<T>(pattern: string, options?: { eager?: boolean }): Record<string, T>;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.svg';
declare module '*.json';
