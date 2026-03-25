const Skeleton = ({ width = '100%', height = '20px', margin = '10px 0', borderRadius = '0px', count = 1 }) => {
  const elements = Array.from({ length: count }, (_, i) => (
    <div 
      key={i}
      style={{
        width,
        height,
        margin,
        borderRadius,
        backgroundColor: '#f0f0f0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'shimmer 1.5s infinite linear'
        }}
      />
    </div>
  ));

  return (
    <>
      {elements}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </>
  );
};

export default Skeleton;
