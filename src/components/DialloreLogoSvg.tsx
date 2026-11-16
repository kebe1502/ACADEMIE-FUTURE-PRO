import React from 'react';

interface DialloreLogoSvgProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const DialloreLogoSvg: React.FC<DialloreLogoSvgProps> = ({
  className = 'w-9 h-9',
  width,
  height,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 560"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="dialloreRedSvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2A2A" />
          <stop offset="50%" stopColor="#E51D1D" />
          <stop offset="100%" stopColor="#C81010" />
        </linearGradient>
      </defs>

      {/* Ballon Ailé */}
      <g id="winged-ball">
        <path
          d="M 215 88 C 205 70 190 48 172 40 C 173 52 178 64 175 75 C 165 58 148 48 136 46 C 140 60 148 76 142 92 C 130 76 116 70 108 72 C 114 86 126 104 140 114 C 158 126 182 126 210 120 Z"
          fill="url(#dialloreRedSvg)"
        />
        <path
          d="M 285 88 C 295 70 310 48 328 40 C 327 52 322 64 325 75 C 335 58 352 48 364 46 C 360 60 352 76 358 92 C 370 76 384 70 392 72 C 386 86 374 104 360 114 C 342 126 318 126 290 120 Z"
          fill="url(#dialloreRedSvg)"
        />
        <circle cx="250" cy="86" r="42" fill="#FFFFFF" stroke="url(#dialloreRedSvg)" strokeWidth="4" />
        <polygon points="250,72 263,81 258,96 242,96 237,81" fill="url(#dialloreRedSvg)" />
        <line x1="250" y1="72" x2="250" y2="52" stroke="url(#dialloreRedSvg)" strokeWidth="3.5" />
        <line x1="263" y1="81" x2="280" y2="76" stroke="url(#dialloreRedSvg)" strokeWidth="3.5" />
        <line x1="258" y1="96" x2="271" y2="114" stroke="url(#dialloreRedSvg)" strokeWidth="3.5" />
        <line x1="242" y1="96" x2="229" y2="114" stroke="url(#dialloreRedSvg)" strokeWidth="3.5" />
        <line x1="237" y1="81" x2="220" y2="76" stroke="url(#dialloreRedSvg)" strokeWidth="3.5" />
      </g>

      {/* Contour du Bouclier */}
      <g id="shield-contour">
        <path
          d="M 120 152 C 170 134 215 158 250 162 C 285 158 330 134 380 152 C 386 240 376 308 340 348 L 326 332 C 358 296 366 236 362 166 C 322 152 284 174 250 178 C 216 174 178 152 138 166 C 134 236 142 296 174 332 L 160 348 C 124 308 114 240 120 152 Z"
          fill="url(#dialloreRedSvg)"
        />
        <path
          d="M 174 406 L 250 472 L 326 406 L 344 416 L 250 498 L 156 416 Z"
          fill="url(#dialloreRedSvg)"
        />
      </g>

      {/* Emblème Aigle / Flamme */}
      <g id="phoenix-emblem" transform="translate(0, 5)">
        <path
          d="M 252 142 C 280 158 312 188 322 226 C 334 274 308 320 262 334 C 216 348 168 320 158 274 C 150 238 168 198 198 174 C 174 194 168 230 176 260 C 186 298 226 322 264 310 C 300 298 318 260 308 224 C 298 188 266 164 252 142 Z"
          fill="url(#dialloreRedSvg)"
        />
        <path
          d="M 276 196 C 264 186 246 182 232 190 C 218 198 206 216 208 232 C 210 244 220 252 232 254 C 216 250 212 238 214 228 C 216 218 226 208 236 204 C 246 200 258 202 268 210 C 282 222 284 244 274 260 C 262 278 238 286 218 280 C 234 282 254 274 264 260 C 272 248 270 232 260 220 C 254 212 244 208 234 212 C 224 216 220 226 222 236 C 224 244 232 250 240 248 C 234 248 230 244 228 238 C 226 232 230 226 236 224 C 242 222 248 226 248 232 C 248 236 244 240 240 240 Z"
          fill="url(#dialloreRedSvg)"
        />
      </g>

      {/* Texte ASC Dialloré */}
      <text
        x="250"
        y="394"
        textAnchor="middle"
        fontFamily="'Impact', 'Arial Black', -apple-system, sans-serif"
        fontWeight="900"
        fontSize="44"
        letterSpacing="0.5"
        fill="url(#dialloreRedSvg)"
      >
        ASC Dialloré
      </text>
    </svg>
  );
};
