"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Play, Pause } from "lucide-react"
import type * as THREE from "three"

interface PackagingComponent {
  type: "plastic" | "cardboard" | "glass" | "metal"
  percentage: number
  recyclable: boolean
  color: string
}

interface PackagingARProps {
  components: PackagingComponent[]
  productName: string
  className?: string
}

function AnimatedPackaging({ components, isPlaying }: { components: PackagingComponent[]; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (isPlaying) {
      setTime(time + delta)
      if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.5
      }
    }
  })

  const getComponentGeometry = (component: PackagingComponent, index: number) => {
    const radius = 1 + index * 0.3
    const position: [number, number, number] = [
      Math.cos((index * (Math.PI * 2)) / components.length) * radius,
      0,
      Math.sin((index * (Math.PI * 2)) / components.length) * radius,
    ]

    switch (component.type) {
      case "plastic":
        return (
          <Box
            key={index}
            position={position}
            args={[0.5, 0.5, 0.5]}
            material-color={component.color}
            material-transparent
            material-opacity={0.8}
          />
        )
      case "glass":
        return (
          <Sphere
            key={index}
            position={position}
            args={[0.3, 16, 16]}
            material-color={component.color}
            material-transparent
            material-opacity={0.9}
          />
        )
      case "cardboard":
        return (
          <Box
            key={index}
            position={position}
            args={[0.6, 0.1, 0.6]}
            material-color={component.color}
            material-transparent
            material-opacity={0.7}
          />
        )
      case "metal":
        return (
          <Sphere
            key={index}
            position={position}
            args={[0.25, 8, 8]}
            material-color={component.color}
            material-metalness={0.8}
            material-roughness={0.2}
          />
        )
      default:
        return null
    }
  }

  return (
    <group ref={groupRef}>
      {components.map((component, index) => (
        <group key={index}>
          {getComponentGeometry(component, index)}
          <Text
            position={[
              Math.cos((index * (Math.PI * 2)) / components.length) * (1 + index * 0.3),
              0.8,
              Math.sin((index * (Math.PI * 2)) / components.length) * (1 + index * 0.3),
            ]}
            fontSize={0.2}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {component.type}
            {"\n"}
            {component.percentage}%
          </Text>
        </group>
      ))}

      {/* Central product representation */}
      <Box
        position={[0, 0, 0]}
        args={[0.8, 1.2, 0.8]}
        material-color="#f3f4f6"
        material-transparent
        material-opacity={0.3}
      />

      <Text position={[0, 1.5, 0]} fontSize={0.3} color="#374151" anchorX="center" anchorY="middle" maxWidth={3}>
        Packaging Breakdown
      </Text>
    </group>
  )
}

export function PackagingAR({ components, productName, className }: PackagingARProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedComponent, setSelectedComponent] = useState<PackagingComponent | null>(null)

  const resetView = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  const totalRecyclable = components.reduce((sum, comp) => (comp.recyclable ? sum + comp.percentage : sum), 0)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Packaging Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Visualization */}
        <div className="h-64 bg-gray-50 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <AnimatedPackaging components={components} isPlaying={isPlaying} />
            <OrbitControls enablePan={false} enableZoom={true} />
          </Canvas>
        </div>

        {/* Component List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Components</span>
            <Badge variant={totalRecyclable >= 70 ? "default" : "secondary"}>{totalRecyclable}% Recyclable</Badge>
          </div>

          <div className="space-y-1">
            {components.map((component, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selectedComponent === component ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedComponent(component)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: component.color }} />
                  <span className="text-sm capitalize">{component.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{component.percentage}%</span>
                  <Badge variant={component.recyclable ? "default" : "secondary"} className="text-xs">
                    {component.recyclable ? "♻️" : "🗑️"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Component Details */}
        {selectedComponent && (
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <div className="font-medium text-blue-900 capitalize">{selectedComponent.type} Details</div>
            <div className="text-sm text-blue-800">
              <div>Percentage: {selectedComponent.percentage}%</div>
              <div>Recyclable: {selectedComponent.recyclable ? "Yes" : "No"}</div>
              <div className="mt-2">
                {selectedComponent.type === "plastic" &&
                  "Can be recycled at most facilities. Look for recycling symbol."}
                {selectedComponent.type === "cardboard" && "Highly recyclable. Remove any plastic components first."}
                {selectedComponent.type === "glass" && "100% recyclable indefinitely. Clean before recycling."}
                {selectedComponent.type === "metal" &&
                  "Highly valuable for recycling. Clean and separate from other materials."}
              </div>
            </div>
          </div>
        )}

        {/* Recycling Instructions */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="font-medium text-green-900 mb-2">Recycling Instructions</div>
          <div className="text-sm text-green-800">
            1. Separate components by material type
            <br />
            2. Clean all containers thoroughly
            <br />
            3. Check local recycling guidelines
            <br />
            4. Use appropriate recycling bins
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
