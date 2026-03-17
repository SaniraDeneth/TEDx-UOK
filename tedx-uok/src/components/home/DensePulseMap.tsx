import { useEffect, useState } from "react";

/**
 * SRI LANKA ABSOLUTE CONTAINMENT POLYGON
 * Manually tuned and buffered from srilanka.svg path data.
 * All edge points have been pulled inland by 5-10 units to guarantee zero sea dots.
 */
const SRI_LANKA_OUTLINE = [
  // --- NORTH (Jaffna Peninsula - Aggressive Pull-in) ---
  [101.7, 5.5], [107.7, 7.5], [109.3, 13.3], [111.0, 15.7], [120, 25], [130, 35], [134.2, 43.5],
  [144.6, 50.0], [155, 56], [165, 66], [172.6, 73.0], [193.7, 90.0],
  [205, 103], [210, 113], [218.2, 128.0], [225, 141], [231.8, 151.0],
  [212.7, 161.0], [204.5, 162.0], [197.5, 165.5],

  // --- NORTH EAST COAST ---
  [205.5, 168.0], [217.8, 176.0], [223.7, 185.0], [218.7, 200.0],
  [223.3, 215.0], [220.7, 225.0], [225.8, 275.0], [246.7, 285.5], [260.2, 288.0],
  [275.9, 295.0], [283.2, 298.0], [294, 288.0],
  [308.8, 275.0], [314.0, 295.0], [321.2, 315.0], [345.7, 350.0],

  // --- EAST COAST (Aggressive Pull-in) ---
  [356.2, 368.0], [366.4, 380.0], [374.3, 400.0], [377.6, 410.0], [374.9, 422.0],
  [378.9, 428.0], [390.0, 435.0], [394.0, 455.0], [392.8, 503.3], [391.8, 510.5],
  [388, 525], [384.6, 538.9], [380.3, 559.3], [363.1, 594.7],

  // --- SOUTH COAST ---
  [348.4, 584.5], [325.6, 605.0], [309.0, 620.0], [297.8, 649.5], [259.7, 666.8],
  [232.0, 673.9], [222.0, 675.7], [205.3, 685.0], [191.0, 692.7], [185.4, 690.1],
  [166.1, 698.0], [146.5, 695.5], [129.2, 690.8], [98.0, 678.3],

  // --- SOUTH WEST COAST ---
  [78.8, 661.5], [63.2, 606.3], [57.0, 605.2], [54.8, 588.3], [42.8, 553.8],
  [41.1, 548.2], [35.8, 539.5], [33.2, 524.7], [33.4, 511.3],

  // --- WEST COAST ---
  [35.6, 504.9], [27.1, 474.6], [30.7, 465.3], [29.7, 457.5], [22.1, 401.3],
  [17.8, 351.3], [13.9, 337.6], [10, 320], [8.6, 310.1], [8.6, 304.3], [16.0, 273.3],
  [21.3, 265.0], [33.8, 249.2], [38.4, 231.3], [45.3, 225.3],
  [50.5, 212.7], [48.6, 169.3], [46.0, 159.6], [40.1, 138.9], [34.9, 134.7],

  // --- NORTH WEST TRANSITION ---
  [14.2, 129.9], [12.2, 134.1], [11.9, 130.7], [10, 100], [5.5, 80], [15.5, 61.5], [5.5, 58.1],
  [7.0, 49.1], [18.3, 58.8], [30, 45], [38.0, 23.2], [41.6, 13.0], [50.3, 10.9],
  [61.2, 7.5], [80, 7.4], [101.7, 5.5]
];

const isPointInPolygon = (px: number, py: number, polygon: number[][]) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

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
  const [nodes, setNodes] = useState<{ svgX: number; svgY: number; delay: number; isFadingDot: boolean }[]>([]);

  useEffect(() => {
    // Start with a fixed seed so dots are always in the same place
    const rnd = seededRandom(12345);
    const newNodes: { svgX: number; svgY: number; delay: number; isFadingDot: boolean }[] = [];
    let attempts = 0;

    while (newNodes.length < NODE_COUNT && attempts < 50000) {
      attempts++;
      const svgX = rnd() * 410;
      const svgY = rnd() * 700;

      if (isPointInPolygon(svgX, svgY, SRI_LANKA_OUTLINE)) {
        // Regional Density Control: Sparse in North and North-East
        const isNorthNE = svgY < 320 || (svgY < 450 && svgX > 220);
        if (isNorthNE && rnd() > 0.20) continue;

        // Visibility check: map raw SVG to the screen % to see if it's in the viewport
        // Updated to match container's top: -60% and height: 250%
        const screenX = -10 + (svgX / 700) * 250;
        const screenY = -60 + (svgY / 700) * 250;

        // Final safety padding: 2% from any edge
        if (screenX >= 2 && screenX <= 98 && screenY >= 2 && screenY <= 98) {
          newNodes.push({
            svgX,
            svgY,
            delay: rnd() * 2.5,
            isFadingDot: rnd() > 0.4,
          });
        }
      }
    }
    setNodes(newNodes);
  }, []);

  const DOT_Y_OFFSET = 1.5; // Final adjustment to lock dots to landmass lines

  return (
    <div className="w-full h-full flex justify-center items-center overflow-visible">
      <style>
        {`
          .dense-map-custom-image {
              filter: grayscale(100%) invert(1) contrast(1000%);
              mix-blend-mode: screen;
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
        `}
      </style>

      <div className="relative w-full h-full min-h-[550px] overflow-hidden bg-black">
        <div
          className="absolute"
          style={{
            width: "250%",
            height: "250%",
            left: "-5%",
            top: "-60%",
          }}
        >
          {/* Map image stretches to fill the 250% wrapper using object-fit: fill */}
          <img
            src="/srilanka.svg"
            alt="Sri Lanka Map"
            className="absolute inset-0 w-full h-full dense-map-custom-image opacity-30 pointer-events-none"
            style={{ objectFit: 'fill' }}
          />

          {/* Dots Layer: Perfectly synced with the image */}
          {nodes.map((node, i) => (
            <div
              key={i}
              className="absolute z-10 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "4.5px",
                height: "4.5px",
                left: `${(node.svgX / 700) * 100}%`,
                top: `${(node.svgY / 700) * 100 + DOT_Y_OFFSET}%`,
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
    </div>
  );
};

export default DensePulseMap;