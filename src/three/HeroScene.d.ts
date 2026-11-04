export type HeroScene = {
    setScroll: (value: number) => void
    setActive: (active: boolean) => void
    destroy: () => void
}

export function createHeroScene(canvas: HTMLCanvasElement, options?: { reducedMotion?: boolean; mirror?: boolean }): HeroScene
