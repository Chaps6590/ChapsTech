const techs = [
  'React', 'Next.js', 'Node.js', 'C#', '.NET',
  'PostgreSQL', 'SQL Server', 'Oracle', 'MongoDB', 'Redis',
  'N8N', 'C#', 'Docker', 'REST APIs', 'GPT-4',
  'LangChain', 'TypeScript', 'Tailwind CSS', 'Git', 'Azure',
];

const TechStack = () => {
  const doubled = [...techs, ...techs];

  return (
    <div className="techstack">
      <div className="techstack-inner">
        <p className="techstack-label">Stack tecnológico</p>
        <div className="techstack-track-wrapper">
          <div className="techstack-track">
            {doubled.map((t, i) => (
              <span key={i} className="tech-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
