import { useEffect, useState } from "react";

/**
 * SEEDED RANDOM NUMBER GENERATOR
 * Ensures identical dot placement across all devices and refreshes.
 */
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const DensePulseMap = () => {
  const NODE_COUNT = 150;
  const [nodes, setNodes] = useState<{ x: number; y: number; delay: number; isFadingDot: boolean }[]>([]);

  useEffect(() => {
    // Start with a fixed seed so dots are always in the same place
    const rnd = seededRandom(12345);
    const newNodes: { x: number; y: number; delay: number; isFadingDot: boolean }[] = [];

    // Map.png is mostly a road network. We can place dots generally anywhere, 
    // maybe avoiding the extreme edges slightly.
    for (let i = 0; i < NODE_COUNT; i++) {
      // Place dots randomly between 5% and 95% of width/height to avoid extreme edges
      const x = 5 + rnd() * 90;
      const y = 5 + rnd() * 90;

      newNodes.push({
        x,
        y,
        delay: rnd() * 2.5,
        isFadingDot: rnd() > 0.4,
      });
    }
    setNodes(newNodes);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <style>
        {`
          .dense-map-custom-image {
              filter: grayscale(100%) invert(1) contrast(1000%) brightness(0.15) sepia(1) saturate(10) hue-rotate(330deg) contrast(2);
          }
          @keyframes densePulseAnimation {
              0% { transform: scale(1); opacity: 0.8; }
              70% { transform: scale(3.5); opacity: 0; }
              100% { opacity: 0; }
          }
          @keyframes dotFadeAnimation {
              0% { opacity: 1; }
              20% { opacity: 1; }
              80% { opacity: 0; }
              100% { opacity: 0; }
          }
          @keyframes drawLine1 {
              0% { stroke-dashoffset: 3400; }
              100% { stroke-dashoffset: 0; }
          }
          @keyframes drawLine2 {
              0% { stroke-dashoffset: 600; }
              25% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 0; }
          }
          @keyframes drawLine3 {
              0% { stroke-dashoffset: 1500; }
              60% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 0; }
          }
        `}
      </style>

      {/* Adjust container styling to fit the new Map.png nicely */}
      <div className="relative w-full bg-transparent overflow-hidden rounded-2xl border border-white/5">
        {/* Map image native height */}
        <img
          src="/Map.png"
          alt="Event Map"
          className="w-full h-auto dense-map-custom-image opacity-80 pointer-events-none"
        />

        {/* SVG Route Line Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
          viewBox="0 0 2912 1472"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Main Route Segment */}
          <path
            d="M6.91119 1438.62L86.9112 1362.12L164.911 1288.62L232.411 1221.12L298.911 1156.62L343.911 1112.12L356.911 1102.12L364.411 1097.62L372.911 1094.62L412.911 1082.12L474.911 1059.12L510.411 1045.12L561.411 1023.62L566.911 1021.62L576.411 1019.62H588.411H597.411H604.911H612.911L649.911 1022.62L691.411 1025.12L716.411 1027.12L737.411 1029.62L766.911 1035.12L780.411 1039.62L793.411 1044.12L809.411 1051.62L817.911 1055.12L826.411 1059.62L841.411 1065.12L852.411 1068.12L866.911 1071.62L886.411 1072.62L909.411 1071.62L930.411 1068.12L945.411 1062.62L1089.41 989.616L1176.91 946.116L1268.91 904.616L1321.91 880.116L1371.41 852.616L1424.91 816.116L1516.41 739.116L1498.91 727.616L1480.91 700.116L1465.91 666.116L1453.41 622.616"
            stroke="#EB0028"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, -18)"
            strokeDasharray="3400"
            strokeDashoffset="3400"
            style={{
              filter: "drop-shadow(0 0 6px rgba(235, 0, 40, 0.6))",
              animation: "drawLine1 8s linear infinite",
            }}
          />
          {/* Second Route Segment */}
          <path
            d="M6.91119 997.116L37.9112 988.616L86.9112 974.116L158.411 953.616L183.911 944.616L205.411 941.616L226.411 940.116L243.911 941.616L265.411 944.616L306.911 953.616L356.411 961.116L412.911 974.116L447.911 985.616L498.411 1006.62L534.911 1033.6"
            stroke="#EB0028"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, -18)"
            strokeDasharray="600"
            strokeDashoffset="600"
            style={{
              filter: "drop-shadow(0 0 6px rgba(235, 0, 40, 0.6))",
              animation: "drawLine2 8s linear infinite",
            }}
          />
          {/* Third Route Segment */}
          <path
            d="M2493.41 6.61621L2485.91 15.1162L2422.91 75.1162L2407.41 91.1162L2386.91 112.616L2370.41 132.116L2353.91 151.616L2255.91 258.616L2219.41 298.616L2180.91 339.116L2111.41 409.116L2096.91 422.116L2082.41 436.616L2055.41 462.116L2003.91 516.616C2003.91 516.616 1988.41 531.116 1963.41 545.616L1935.91 561.616L1906.91 578.116L1851.41 610.116L1801.91 635.616L1783.41 641.616L1767.91 646.116L1746.41 651.116L1724.41 655.616L1680.91 666.116L1626.41 680.116L1572.91 696.616L1543.96 714.999L1517.41 737.616"
            stroke="#EB0028"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, -22)"
            strokeDasharray="1500"
            strokeDashoffset="1500"
            style={{
              filter: "drop-shadow(0 0 6px rgba(235, 0, 40, 0.6))",
              animation: "drawLine3 8s linear infinite",
            }}
          />


        </svg>

        {/* Dots Layer: Perfectly synced with the % of the container */}
        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute z-10 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "4.5px",
              height: "4.5px",
              left: `${node.x}%`,
              top: `${node.y}%`,
              background: "#EB0028",
              boxShadow: "0 0 8px #EB0028",
              animation: node.isFadingDot ? "dotFadeAnimation 2.2s infinite" : "none",
              animationDelay: `${node.delay}s`,
            }}
          >
            <div
              className="absolute inset-0 w-full h-full rounded-full bg-[#EB0028] opacity-70"
              style={{
                animation: "densePulseAnimation 2.2s infinite",
                animationDelay: `${node.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DensePulseMap;