'use client'

import { Card } from "@/components/ui/card"

interface ChartNodeProps {
  department: string
  title: string
  name: string
  className?: string
}

function ChartNode({ department, title, name, className = "" }: ChartNodeProps) {
  return (
    <Card className={`p-3 min-w-[200px] text-center border border-border ${className}`}>
      <div className="text-xs text-muted-foreground">{department}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm">{name}</div>
    </Card>
  )
}

export function OrganizationChart() {
  return (
    <div className="relative min-h-[400px] w-full overflow-x-auto ">
      <div className="absolute inset-0 flex flex-col items-center">
        {/* Top Level */}
        <div className="flex justify-center">
          <ChartNode
            department="Emergency Response Team"
            title="ERT Manager"
            name="Gilbert Lambert"
          />
        </div>
        
        {/* Vertical Line */}
        <div className="h-8 w-px bg-border" />
        
        {/* Second Level */}
        <div className="flex justify-center">
          <ChartNode
            department="Emergency Response Team"
            title="Deputy Manager"
            name="Daniel Brown"
          />
        </div>
        
        {/* Vertical Line */}
        <div className="h-8 w-px bg-border" />
        
        {/* Bottom Level Container */}
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-0 left-1/2 h-px w-[650px] bg-border -translate-x-1/2" />
          
          {/* Bottom Level Nodes */}
          <div className="flex gap-4 -mt-[1px]">
            {/* Left Side Node */}
           
            
            {/* Main Nodes */}
            <div className="flex gap-4">
             
              
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <ChartNode
                  department="Emergency Response Team"
                  title="Communication focal point"
                  name="Daniel Brown"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <ChartNode
                  department="Emergency Response Team"
                  title="Coast guard focal point"
                  name="Daniel Brown"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <ChartNode
                  department="Emergency Response Team"
                  title="Ops focal point"
                  name="Daniel Brown"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <ChartNode
                  department="Emergency Response Team"
                  title="HSE focal point"
                  name="Daniel Brown"
                />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  )
}

