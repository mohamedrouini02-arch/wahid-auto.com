export type World = {
    setProgress: (value: number) => void
    jumpTo: (value: number) => void
    setActive: (active: boolean) => void
    destroy: () => void
}

export function createWorld(canvas: HTMLCanvasElement, options?: { reducedMotion?: boolean; mirror?: boolean }): World
