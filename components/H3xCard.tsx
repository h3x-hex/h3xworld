import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function H3xCard(props: any) {
  const group = useRef({props})
  const { nodes, materials } = useGLTF('models/h3xCard.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Cube"
          position={[0.092, 0, -0.026]}
          rotation={[0, 0, 0]}
          scale={[-9.978, -6.21, -0.1]}>
          <mesh
            name="Cube001"
            castShadow
            receiveShadow
            //@ts-expect-error React 3D can ignore error warning
            geometry={nodes.Cube001.geometry}
            material={materials['Brushed black metal brass']}
          />
          <mesh
            name="Cube001_1"
            castShadow
            receiveShadow
            //@ts-expect-error React 3D can ignore error warning
            geometry={nodes.Cube001_1.geometry}
            material={materials['Material.001']}
          />
          <mesh
            name="Cube001_2"
            castShadow
            receiveShadow
            //@ts-expect-error React 3D can ignore error warning
            geometry={nodes.Cube001_2.geometry}
            material={materials['Material.004']}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/h3xCard.glb') 