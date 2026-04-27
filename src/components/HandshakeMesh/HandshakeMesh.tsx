import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  className?: string
}

export function HandshakeMesh({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // ─── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ─── Scene ────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ─── Camera ───────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0.3, 10)
    camera.lookAt(0, 0, 0)

    // ─── Resize ───────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    onResize()
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    // ─── Materials ────────────────────────────────────────────
    const surfaceMat = new THREE.MeshBasicMaterial({
      color: 0x5d67e6,
      transparent: true,
      opacity: 0.055,
      side: THREE.DoubleSide,
    })

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x5d67e6,
      transparent: true,
      opacity: 0.78,
    })

    // ─── Helpers ──────────────────────────────────────────────
    const addTube = (
      pts: [number, number, number][],
      radius = 0.045,
      tubeSeg = 32,
      radSeg = 7,
    ) => {
      const curve = new THREE.CatmullRomCurve3(
        pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      )
      const geo = new THREE.TubeGeometry(curve, tubeSeg, radius, radSeg, false)
      scene.add(new THREE.Mesh(geo, surfaceMat))
      scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 18), wireMat))
    }

    const addNode = (x: number, y: number, z: number, r: number) => {
      const geo = new THREE.IcosahedronGeometry(r, 1)
      const group = new THREE.Group()
      group.position.set(x, y, z)
      group.add(new THREE.Mesh(geo, surfaceMat))
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), wireMat))
      scene.add(group)
    }

    // ─── Left hand (→) ────────────────────────────────────────
    // Wrist / palm (thick anchor tube)
    addTube([[-2.5, -0.15, 0.0], [-1.9, -0.05, 0.12], [-1.3, 0.0, 0.08]], 0.23)
    addNode(-2.0, -0.05, 0.1, 0.15)

    // Index finger
    addTube([[-1.3, 0.60,  0.10], [-0.65, 0.58,  0.08], [ 0.00,  0.44,  0.04]], 0.045)
    // Middle finger
    addTube([[-1.3, 0.25, -0.06], [-0.55, 0.24, -0.04], [ 0.10,  0.14,  0.12]], 0.045)
    // Ring finger
    addTube([[-1.3, -0.10,  0.14], [-0.55, -0.08,  0.12], [ 0.10, -0.22, -0.06]], 0.040)
    // Pinky
    addTube([[-1.3, -0.42, -0.06], [-0.65, -0.42, -0.06], [ 0.00, -0.54,  0.10]], 0.033)
    // Thumb (arcing over the grip)
    addTube([[-2.1, -0.55, -0.16], [-1.4, -0.18, -0.22], [-0.5,  0.46, -0.18], [ 0.10,  0.68, -0.08]], 0.042)

    // ─── Right hand (←) ───────────────────────────────────────
    // Wrist / palm
    addTube([[ 2.5, -0.15,  0.0], [ 1.9, -0.05, -0.12], [ 1.3,  0.0, -0.08]], 0.23)
    addNode( 2.0, -0.05, -0.1, 0.15)

    // Index finger — offset in z to weave between left fingers
    addTube([[ 1.3,  0.60, -0.10], [ 0.65,  0.58, -0.08], [ 0.00,  0.42, -0.04]], 0.045)
    // Middle finger
    addTube([[ 1.3,  0.25,  0.06], [ 0.55,  0.24,  0.04], [-0.10,  0.12, -0.12]], 0.045)
    // Ring finger
    addTube([[ 1.3, -0.10, -0.14], [ 0.55, -0.08, -0.12], [-0.10, -0.24,  0.06]], 0.040)
    // Pinky
    addTube([[ 1.3, -0.42,  0.06], [ 0.65, -0.42,  0.06], [ 0.00, -0.56, -0.10]], 0.033)
    // Thumb (arcing over, opposite z)
    addTube([[ 2.1, -0.55,  0.16], [ 1.4, -0.18,  0.22], [ 0.5,  0.46,  0.18], [-0.10,  0.66,  0.08]], 0.042)

    // ─── Grip centre ──────────────────────────────────────────
    addNode(0, 0.08, 0, 0.18)

    // Fingertip nodes where the two hands meet
    const tips: [number, number, number][] = [
      [ 0.00,  0.44,  0.04], [ 0.10,  0.14,  0.12],
      [ 0.10, -0.22, -0.06], [ 0.00, -0.54,  0.10],
      [ 0.00,  0.42, -0.04], [-0.10,  0.12, -0.12],
      [-0.10, -0.24,  0.06], [ 0.00, -0.56, -0.10],
    ]
    tips.forEach(([x, y, z]) => addNode(x, y, z, 0.058))

    // Scale scene to fit portrait viewport comfortably
    scene.scale.setScalar(0.62)

    // ─── Animation loop ───────────────────────────────────────
    let rafId: number
    const clock = new THREE.Clock()

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // Gentle rock — shows 3D depth without full spin
      scene.rotation.y = Math.sin(t * 0.22) * 0.45
      scene.rotation.x = Math.sin(t * 0.14) * 0.09

      // Subtle breathing scale
      const breathe = 0.62 + Math.sin(t * 0.5) * 0.012
      scene.scale.setScalar(breathe)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
