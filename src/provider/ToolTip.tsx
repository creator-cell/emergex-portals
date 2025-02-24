// components/Tooltip.tsx
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Default Tippy.js CSS
import "tippy.js/themes/light.css"; // Optional theme (light, material, etc.)
import "tippy.js/animations/scale.css"; // Optional animation

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <Tippy
    content={
        <div className="z-50 rounded-lg bg-white text-[#ddeadb]">
          {content}
        </div>
      }
      placement="top"
      animation="scale"
      theme="light"
      interactive={true} 
      arrow={true} 
      delay={[100, 0]}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;