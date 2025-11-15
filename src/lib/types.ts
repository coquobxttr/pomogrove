import type * as THREE from 'three'

export interface GridObject {
    blockType: string;
    unlockDate: Date;
    pomodoro_time: number;
    x: number;
    z: number;
}

export enum pomEndMessages {
    bad = "That session was kinda short. Are you sure you don't want to work more?",
    ok = "What a Shame, you were almost done!",
    good = "Good session!"
}

export function formatTime(totalSeconds: number): string {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export type geoTypes =
    | THREE.BoxGeometry
    | THREE.SphereGeometry
    | THREE.DodecahedronGeometry
    | THREE.CylinderGeometry

export type itemType = {
    dom: HTMLElement | undefined
    geometry: geoTypes
    material: THREE.MeshStandardMaterial
}
