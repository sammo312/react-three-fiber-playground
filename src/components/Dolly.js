function Dolly ({ x, y, z }) {
    const ref = useRef()
    // useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))

    useFrame((state, delta) => {
      const step = 0.1
      //zoom level
      state.camera.fov = THREE.MathUtils.lerp(
        state.camera.fov,
        zoom ? 10 : 50,
        step
      )
      //item position
      state.camera.position.lerp(
        dummy.set(zoom ? 25 : 1, zoom ? 1 : 3, zoom ? -50 : 10),
        step
      )

      //camera waving
      if (!zoom) {
        lookAtPos.x = 0
        lookAtPos.y = 0
      } else {
        lookAtPos.x = 0
        lookAtPos.y = 2
      }

      state.camera.lookAt(lookAtPos)
      state.camera.updateProjectionMatrix()
    })

    return <Html />
  }