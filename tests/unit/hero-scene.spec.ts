import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import HeroScene from "~/components/visual/HeroScene.vue";

describe("HeroScene", () => {
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      setTimeout(() => callback(0), 16) as unknown as number) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = ((handle: number) =>
      clearTimeout(handle as unknown as NodeJS.Timeout)) as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it("renders the fallback gradient when WebGL is unavailable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

    const wrapper = mount(HeroScene, {
      props: {
        enabled: true,
        primaryColor: "#123456",
        secondaryColor: "#abcdef",
        accentColor: "#ff00ff",
        particleDensity: 0.6,
        bloomIntensity: 0.5,
        rotationSpeed: 0.2,
        noiseStrength: 0.3,
      },
    });

    await nextTick();

    expect(wrapper.attributes("data-state")).toBe("fallback");
    expect(wrapper.find(".hero-scene__fallback").exists()).toBe(true);
  });
});
