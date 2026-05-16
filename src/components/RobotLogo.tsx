export function RobotLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M4 14C4 9.582 7.582 6 12 6H68C72.418 6 76 9.582 76 14V52C76 56.418 72.418 60 68 60H30L16 72V60H12C7.582 60 4 56.418 4 52V14Z" fill="#E84118"/>
      <circle cx="40" cy="35" r="14" fill="white"/>
      <circle cx="33" cy="34" r="5.5" fill="#18303C"/>
      <circle cx="47" cy="34" r="5.5" fill="#18303C"/>
      <circle cx="35" cy="32" r="2" fill="white"/>
      <circle cx="49" cy="32" r="2" fill="white"/>
      <path d="M28 58C28 52 33 48 40 48C47 48 52 52 52 58" fill="white" opacity="0.85"/>
    </svg>
  );
}