'use client';

import { ParticleCanvas } from '@/components/ui/ParticleCanvas';
import { SectionTitle } from '@/components/ui/section-title';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const codeSnippet = `// Get the canvas element and set up the 2D context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Define a function to resize the canvas
let width, height;
function resizeCanvas() {
  const wrapper = document.querySelector('.canvas-wrapper');
  width = canvas.width = wrapper.offsetWidth;
  height = canvas.height = wrapper.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Speed, number of points, and connection distance
let SPEED = 1;
const DIST = 200;
const number = 80;
let points = [];

// Generate random points (position and velocity)
for (let i = 0; i < number; i++) {
  points.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED
  });
}

// Calculate distance between two points
function getDist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Draw lines between close points
function drawLines() {
  for (let i = 0; i < number - 1; i++) {
    for (let j = i + 1; j < number; j++) {
      const dist = getDist(points[i], points[j]);
      if (dist <= DIST) {
        const alpha = 1 - dist / DIST;
        context.strokeStyle = \`rgba(0, 187, 184, \${alpha})\`;
        context.lineWidth = Math.pow(1 - dist / DIST, 1.5);
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        context.lineTo(points[j].x, points[j].y);
        context.stroke();
      }
    }
  }
}

// Animate the canvas
function animate() {
  context.clearRect(0, 0, width, height);
  drawLines();
  // Draw and update points...
  requestAnimationFrame(animate);
}

animate();`;

// Syntax highlighting function
const highlightCode = (code: string) => {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    // Tokenize the line
    const tokens: { text: string; type: string }[] = [];
    let remaining = line;

    while (remaining.length > 0) {
      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        tokens.push({ text: commentMatch[1], type: 'comment' });
        remaining = remaining.slice(commentMatch[1].length);
        continue;
      }

      // Strings (single quotes, double quotes, template literals)
      const stringMatch = remaining.match(/^('[^']*'|"[^"]*"|`[^`]*`)/);
      if (stringMatch) {
        tokens.push({ text: stringMatch[1], type: 'string' });
        remaining = remaining.slice(stringMatch[1].length);
        continue;
      }

      // Keywords
      const keywordMatch = remaining.match(
        /^(const|let|var|function|if|else|for|while|return|new|this|true|false|null|undefined)\b/,
      );
      if (keywordMatch) {
        tokens.push({ text: keywordMatch[1], type: 'keyword' });
        remaining = remaining.slice(keywordMatch[1].length);
        continue;
      }

      // Built-in objects/methods
      const builtinMatch = remaining.match(
        /^(document|window|console|Math|Array|Object|String|Number|querySelector|querySelectorAll|getElementById|getContext|addEventListener|requestAnimationFrame|clearRect|beginPath|moveTo|lineTo|stroke|push|random|sqrt|pow)\b/,
      );
      if (builtinMatch) {
        tokens.push({ text: builtinMatch[1], type: 'builtin' });
        remaining = remaining.slice(builtinMatch[1].length);
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numberMatch) {
        tokens.push({ text: numberMatch[1], type: 'number' });
        remaining = remaining.slice(numberMatch[1].length);
        continue;
      }

      // Operators
      const operatorMatch = remaining.match(/^([+\-*/%=<>!&|?:]+)/);
      if (operatorMatch) {
        tokens.push({ text: operatorMatch[1], type: 'operator' });
        remaining = remaining.slice(operatorMatch[1].length);
        continue;
      }

      // Brackets and punctuation
      const punctMatch = remaining.match(/^([(){}[\];,.])/);
      if (punctMatch) {
        tokens.push({ text: punctMatch[1], type: 'punctuation' });
        remaining = remaining.slice(punctMatch[1].length);
        continue;
      }

      // Property access (after dot)
      const propMatch = remaining.match(/^(\w+)/);
      if (propMatch) {
        tokens.push({ text: propMatch[1], type: 'identifier' });
        remaining = remaining.slice(propMatch[1].length);
        continue;
      }

      // Whitespace
      const spaceMatch = remaining.match(/^(\s+)/);
      if (spaceMatch) {
        tokens.push({ text: spaceMatch[1], type: 'space' });
        remaining = remaining.slice(spaceMatch[1].length);
        continue;
      }

      // Fallback: single character
      tokens.push({ text: remaining[0], type: 'text' });
      remaining = remaining.slice(1);
    }

    return (
      <div key={`line-${lineIndex}`} className="hover:bg-foreground/5 transition-colors flex">
        <span className="text-muted-foreground/50 w-8 flex-shrink-0 select-none text-xs text-right pr-4">
          {String(lineIndex + 1).padStart(2, '0')}
        </span>

        <span className="flex-1">
          {tokens.map((token, tokenIndex) => {
            let className = '';

            switch (token.type) {
              case 'comment':
                className = 'text-muted-foreground italic';
                break;
              case 'string':
                className = 'text-[hsl(var(--glow-yellow))]';
                break;
              case 'keyword':
                className = 'text-[hsl(var(--glow-pink))] font-semibold';
                break;
              case 'builtin':
                className = 'text-[hsl(var(--glow-blue))]';
                break;
              case 'number':
                className = 'text-[hsl(142,76%,60%)]';
                break;
              case 'operator':
                className = 'text-[hsl(var(--glow-cyan))]';
                break;
              case 'punctuation':
                className = 'text-muted-foreground';
                break;
              default:
                className = 'text-foreground';
            }

            return (
              <span key={`token-${lineIndex}-${tokenIndex}`} className={className}>
                {token.text}
              </span>
            );
          })}
        </span>
      </div>
    );
  });
};

export function CodeSection() {
  const { t } = useTranslation();
  return (
    <LazyMotion features={domAnimation}>
      <section
        id="code"
        className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/5 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Section Title */}
            <SectionTitle number={t('code.number')} title={t('code.title')} />

            {/* Content */}
            <div className="flex-1">
              {/* Heading */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {t('code.heading')}
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t('code.description')}</p>
              </m.div>

              {/* Code and Canvas Grid */}
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                {/* Particle Canvas */}
                <m.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-border bg-card/30"
                >
                  <ParticleCanvas />
                  <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-lg">
                    <span className="text-sm text-primary font-medium">{t('code.liveCanvas')}</span>
                  </div>
                </m.div>

                {/* Code Preview */}
                <m.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative min-h-[400px] lg:min-h-[500px] max-h-[500px] rounded-2xl overflow-hidden border border-border bg-card/50"
                >
                  {/* Code header */}
                  <div className="sticky top-0 flex items-center gap-2 px-4 py-3 bg-card border-b border-border z-10">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-destructive/80" />
                      <span className="w-3 h-3 rounded-full bg-[hsl(var(--glow-yellow))]/80" />
                      <span className="w-3 h-3 rounded-full bg-[hsl(142,76%,50%)]/80" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">particle-canvas.js</span>
                  </div>

                  {/* Code content */}
                  <div className="overflow-y-auto h-[calc(100%-48px)] p-4 scrollbar-thin">
                    <pre className="text-sm leading-relaxed font-mono">
                      <code>
                        <>{highlightCode(codeSnippet)}</>
                      </code>
                    </pre>
                  </div>
                </m.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default CodeSection;
