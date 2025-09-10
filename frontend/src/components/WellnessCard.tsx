import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WellnessCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  progress?: number;
  progressColor: string;
  emoji?: string;
}

export function WellnessCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconBgColor, 
  progress,
  progressColor,
  emoji 
}: WellnessCardProps) {
  return (
    <Card className="wellness-card-elevated p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          {emoji ? (
            <span className="text-2xl">{emoji}</span>
          ) : (
            <Icon className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2" 
              style={{ 
                background: 'hsl(var(--muted))',
              }}
            />
            {/* <div className="flex justify-end">
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div> */}
          </div>
        )}
      </div>
    </Card>
  );
}




// import React from "react";
// import { LucideIcon } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// interface WellnessCardProps {
//   title: string;
//   subtitle: string;
//   icon: LucideIcon;
//   iconBgColor: string;
//   progress?: number;
//   progressColor: string;
//   emoji?: string;
// }

// export function WellnessCard({
//   title,
//   subtitle,
//   icon: Icon,
//   iconBgColor,
//   progress,
//   progressColor,
//   emoji
// }: WellnessCardProps) {
//   return (
//     <Card className="rounded-2xl shadow bg-white p-6 min-w-[200px] transition-all">
//       <div className="flex items-center justify-between mb-2">
//         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
//           <Icon className="w-6 h-6 text-gray-600" />
//         </div>
//         {emoji && (
//           <span className="text-2xl">{emoji}</span>
//         )}
//       </div>
//       <h3 className="font-semibold text-md text-gray-800 mt-1">{title}</h3>
//       <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
//       {progress !== undefined && (
//         <div className="pt-3 pb-0 flex flex-col gap-2">
//           <div className="w-full h-2 bg-gray-200 rounded-md overflow-hidden">
//             <div
//               className={`rounded-md transition-all ${progressColor}`}
//               style={{
//                 height: "0.5rem",
//                 width: `${progress}%`
//               }}
//             ></div>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }
