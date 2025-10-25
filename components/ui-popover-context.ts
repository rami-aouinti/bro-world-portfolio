import type { InjectionKey, Ref } from "vue";

export interface UiPopoverContext {
  id: string;
  isOpen: Ref<boolean>;
  trigger: Ref<HTMLElement | null>;
  content: Ref<HTMLElement | null>;
  open: () => void;
  close: () => void;
  toggle: (value?: boolean) => void;
  setTrigger: (el: HTMLElement | null) => void;
  setContent: (el: HTMLElement | null) => void;
}

export const uiPopoverContextKey: InjectionKey<UiPopoverContext> = Symbol("UiPopoverContext");
