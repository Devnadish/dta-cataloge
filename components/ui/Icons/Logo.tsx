export default function Logo() {
  return (
    <svg
      width="240"
      height="100"
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Family Unity Logo</title>
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#808080" stopOpacity="1" />
          <stop offset="100%" stopColor="#0000FF" stopOpacity="1" />
        </radialGradient>
      </defs>
      <g transform="translate(20,10)">
        <circle cx="60" cy="40" r="12" fill="url(#grad1)" />
        <circle cx="120" cy="40" r="16" fill="url(#grad1)" />
        <circle cx="180" cy="40" r="12" fill="url(#grad1)" />
        <path
          d="M70 40 C90 10, 150 10, 170 40"
          stroke="#0000FF"
          strokeWidth="4"
          fill="none"
          stroke-linecap="round"
        />
      </g>
    </svg>
  );
}
