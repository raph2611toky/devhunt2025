
"use client"
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useFBX } from '@react-three/drei';
import {
  Group,
  AnimationMixer,
  AnimationClip,
  Object3D,
  AnimationAction,
} from 'three';
import { div } from 'three/tsl';

interface CharacterModelProps {
  url: string;
  targetComponent?: string;
}

function CharacterModel({
  url,
  targetComponent = 'LeftArm',
}: CharacterModelProps) {

  const fbx = useFBX(url);
  const groupRef = useRef<Group>(null!);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const targetRef = useRef<Object3D | null>(null);
  const leftArmRef = useRef<Object3D | null>(null);
  const rightArmRef = useRef<Object3D | null>(null);
  const [action, setAction] = useState<AnimationAction | null>(null);

  useEffect(() => {
    if (fbx) {

      fbx.scale.set(0.035, 0.035, 0.035);
      fbx.position.set(0, -3, 0);

      fbx.traverse((child) => {
        if (child.name === targetComponent) {
          targetRef.current = child;
          console.log(`Composant trouvé : ${child.name}`, child);
        }
        if (child.name === 'mixamorigLeftArm') {
          leftArmRef.current = child;
          console.log(`Bras gauche trouvé : ${child.name}`, child);
          child.rotation.z = Math.PI / 2; 
        }
        if (child.name === 'mixamorigRightArm') {
          rightArmRef.current = child;
          console.log(`Bras droit trouvé : ${child.name}`, child);
          child.rotation.z = -Math.PI / 2;
        }
      });

      mixerRef.current = new AnimationMixer(fbx);
      
    }

    return () => {
      
    };
  }, [fbx, targetComponent]);


  return <primitive ref={groupRef} object={fbx} />;
}


export default function Home() {
  return (
    <div className='h-screen w-screen bg-red-500 relative'>
      <div className="w-72 h-60 bg-white bottom-20 right-20 absolute">
        <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <CharacterModel
            url="/assets/models/character2.fbx"
            targetComponent="mixamorigLeftArm"
          />
        </Canvas>
      </div>
    </div>
  );
}